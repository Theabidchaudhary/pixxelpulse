import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { config } from '../config.js';
import { ApiError } from './errors.js';

export interface YtDlpFormat {
  format_id: string;
  ext?: string;
  vcodec?: string;
  acodec?: string;
  width?: number | null;
  height?: number | null;
  fps?: number | null;
  filesize?: number | null;
  filesize_approx?: number | null;
  tbr?: number | null;
  abr?: number | null;
  url?: string;
  protocol?: string;
  format_note?: string;
}

export interface YtDlpInfo {
  id: string;
  title?: string;
  description?: string;
  duration?: number | null;
  uploader?: string;
  channel?: string;
  thumbnail?: string;
  thumbnails?: Array<{ url: string; width?: number; height?: number }>;
  webpage_url?: string;
  extractor_key?: string;
  formats?: YtDlpFormat[];
  _type?: string;
  entries?: Array<{
    id?: string;
    title?: string;
    url?: string;
    duration?: number | null;
    thumbnails?: Array<{ url: string }>;
  }>;
}

export interface RunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

const EXTRACTION_TIMEOUT_MS = 45_000;

export const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Persistent yt-dlp cache directory. yt-dlp caches expensive per-extractor
 * work here (YouTube's signature/nsig JS interpreter results, etc.) so
 * repeat requests within the same running container skip re-deriving it.
 * Explicit path because the container no longer runs as a dedicated user
 * with a predictable $HOME, and /tmp is always writable.
 */
export const YTDLP_CACHE_DIR = '/tmp/vessel-ytdlp-cache';

/**
 * Cookies exported from a logged-in browser (Netscape cookies.txt format).
 * This is the only reliable fix for "Sign in to confirm you're not a bot"
 * (YouTube) and similar login walls (X/Twitter) that cloud-hosted IPs hit
 * far more often than home connections. Configure via the COOKIES_FILE env
 * var; harmless no-op when unset.
 */
function cookieArgs(): string[] {
  return config.COOKIES_FILE ? ['--cookies', config.COOKIES_FILE] : [];
}

/**
 * Primary attempt args per platform, tuned for the best balance of success
 * rate and speed. `fallbackPlatformArgs` below supplies a second attempt
 * with a different strategy when this one fails.
 */
export function platformArgs(url: string): string[] {
  if (/youtube\.com|youtu\.be/i.test(url)) {
    return [
      // Two clients only (not yt-dlp's full client list) — each additional
      // client is a full extra network round-trip to YouTube's internal
      // API, so this is the resilience/speed tradeoff point. "tv" tends to
      // dodge the bot-check wall more often than "web"; player_skip=webpage
      // skips fetching the HTML page entirely since these clients don't
      // need it. formats=missing_pot keeps formats that would otherwise be
      // silently dropped for lacking a PO token — without it, some videos
      // resolve to zero downloadable formats even though metadata fetch
      // succeeded, which looks identical to "removed or private" downstream.
      '--extractor-args', 'youtube:player_client=tv,web;player_skip=webpage;formats=missing_pot',
      ...cookieArgs(),
    ];
  }
  if (/tiktok\.com/i.test(url)) {
    return ['--add-header', 'Referer:https://www.tiktok.com/'];
  }
  if (/twitter\.com|x\.com/i.test(url)) {
    return [
      '--add-header', 'Referer:https://x.com/',
      // The syndication API is the unauthenticated embed endpoint; it works
      // for far more tweets from datacenter IPs than the logged-out graphql
      // path, which X increasingly gates behind a login wall.
      '--extractor-args', 'twitter:api=syndication',
      ...cookieArgs(),
    ];
  }
  if (/instagram\.com/i.test(url)) {
    return ['--add-header', 'Referer:https://www.instagram.com/', ...cookieArgs()];
  }
  return [];
}

/**
 * Second-attempt args, only used if the primary attempt above fails. Tries a
 * meaningfully different strategy rather than repeating the same request —
 * e.g. a different YouTube player client, or X's regular (non-syndication)
 * path in case syndication itself is the thing being rate-limited.
 * Returns null when there's no meaningfully different fallback to try.
 */
function fallbackPlatformArgs(url: string): string[] | null {
  if (/youtube\.com|youtu\.be/i.test(url)) {
    return [
      '--extractor-args', 'youtube:player_client=android,mweb;formats=missing_pot',
      ...cookieArgs(),
    ];
  }
  if (/twitter\.com|x\.com/i.test(url)) {
    return ['--add-header', 'Referer:https://x.com/', ...cookieArgs()];
  }
  return null;
}

/**
 * Run yt-dlp with the given args and collect stdout. Rejects with a typed
 * ApiError on non-zero exit so route handlers never leak raw stderr to
 * clients (it still lands in the server log).
 */
export function runYtDlp(args: string[], timeoutMs = EXTRACTION_TIMEOUT_MS): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(config.YTDLP_PATH, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, PYTHONUNBUFFERED: '1' },
    });

    let stdout = '';
    let stderr = '';
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill('SIGKILL');
      reject(ApiError.extractionFailed({ reason: 'timeout' }));
    }, timeoutMs);

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8');
    });
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
    });

    child.on('error', (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(
        new ApiError('INTERNAL', 'yt-dlp is not installed or not on PATH.', 500, {
          cause: err.message,
        }),
      );
    });

    child.on('close', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ stdout, stderr, exitCode: code ?? -1 });
    });
  });
}

function baseFetchArgs(opts: { playlist: boolean }): string[] {
  return [
    '--user-agent', BROWSER_USER_AGENT,
    '--add-header', 'Accept-Language:en-US,en;q=0.9',
    '--no-warnings',
    '--no-call-home',
    '--no-check-certificates',
    // Skips the extra HTTP request(s) yt-dlp otherwise makes to verify each
    // format's URL is actually reachable before returning it — the single
    // biggest per-request latency cost on platforms with many formats
    // (Instagram/Facebook especially). We only ever hand out formats the
    // extractor itself reported, so this trades a rare stale-URL edge case
    // for several seconds off every fetch.
    '--no-check-formats',
    '--cache-dir', YTDLP_CACHE_DIR,
    '--dump-single-json',
    ...(opts.playlist ? ['--flat-playlist'] : ['--no-playlist']),
  ];
}

async function fetchInfoOnce(url: string, opts: { playlist: boolean }, extraArgs: string[]): Promise<YtDlpInfo> {
  const args = [...baseFetchArgs(opts), ...extraArgs, '--', url];
  const result = await runYtDlp(args);
  if (result.exitCode !== 0) {
    throw classifyExtractionError(result.stderr);
  }
  try {
    return JSON.parse(result.stdout) as YtDlpInfo;
  } catch {
    throw ApiError.extractionFailed({ reason: 'unparseable-metadata' });
  }
}

export async function fetchInfo(url: string, opts: { playlist: boolean }): Promise<YtDlpInfo> {
  try {
    return await fetchInfoOnce(url, opts, platformArgs(url));
  } catch (firstErr) {
    const fallback = fallbackPlatformArgs(url);
    if (!fallback) throw firstErr;
    try {
      return await fetchInfoOnce(url, opts, fallback);
    } catch {
      // Surface the original error — it's typically the more informative one
      // since the primary strategy is chosen to be the better first guess.
      throw firstErr;
    }
  }
}

function classifyExtractionError(stderr: string): ApiError {
  const lower = stderr.toLowerCase();
  if (
    lower.includes('video unavailable') ||
    lower.includes('this post is unavailable') ||
    lower.includes('content not available') ||
    lower.includes('has been removed') ||
    lower.includes('no longer available') ||
    lower.includes('http error 404') ||
    lower.includes(': 404')
  ) {
    return ApiError.mediaUnavailable();
  }
  if (
    lower.includes('private video') ||
    lower.includes('login required') ||
    lower.includes('sign in to confirm') ||
    lower.includes('age-restricted') ||
    lower.includes('members-only') ||
    lower.includes('this content isn') ||
    lower.includes('account required') ||
    lower.includes('rate-limit') ||
    lower.includes('http error 429')
  ) {
    return ApiError.requiresLogin();
  }
  return ApiError.extractionFailed({ stderr: stderr.slice(0, 500) });
}
