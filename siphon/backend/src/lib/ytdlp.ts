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

export async function fetchInfo(url: string, opts: { playlist: boolean }): Promise<YtDlpInfo> {
  const args = [
    '--dump-single-json',
    '--no-warnings',
    '--no-call-home',
    '--no-check-certificates',
    ...(opts.playlist ? ['--flat-playlist'] : ['--no-playlist']),
    '--',
    url,
  ];

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

function classifyExtractionError(stderr: string): ApiError {
  const lower = stderr.toLowerCase();
  if (
    lower.includes('video unavailable') ||
    lower.includes('this post is unavailable') ||
    lower.includes('removed') ||
    lower.includes('404')
  ) {
    return ApiError.mediaUnavailable();
  }
  return ApiError.extractionFailed({ stderr: stderr.slice(0, 500) });
}
