/** Typed client for the Siphon API. Mirrors backend/src/services/extractor.ts. */

export type Platform = 'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'facebook';

export interface ResolvedFormat {
  id: string;
  kind: 'video' | 'audio';
  container: 'mp4' | 'mp3' | 'm4a';
  qualityLabel: string;
  width: number | null;
  height: number | null;
  fps: number | null;
  sizeBytes: number | null;
  sizeIsEstimate: boolean;
  directUrl: string | null;
  requiresProcessing: boolean;
  downloadUrl: string;
}

export interface ResolvedMedia {
  type: 'media';
  platform: Platform;
  kind: string;
  sourceUrl: string;
  title: string;
  uploader: string | null;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  video: ResolvedFormat[];
  audio: ResolvedFormat[];
  expiresAt: string;
}

export interface ResolvedPlaylist {
  type: 'playlist';
  platform: Platform;
  sourceUrl: string;
  title: string;
  entryCount: number;
  entries: Array<{
    title: string;
    url: string;
    durationSeconds: number | null;
    thumbnailUrl: string | null;
  }>;
}

export type ResolveResult = ResolvedMedia | ResolvedPlaylist;

export class ApiRequestError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export async function resolve(url: string, signal?: AbortSignal): Promise<ResolveResult> {
  let response: Response;
  try {
    response = await fetch('/api/v1/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new ApiRequestError('NETWORK', 'Could not reach the Siphon API. Check your connection.');
  }

  const body = (await response.json().catch(() => null)) as
    | ResolveResult
    | { error?: { code?: string; message?: string } }
    | null;

  if (!response.ok || !body || !('type' in body)) {
    const error = body && 'error' in body ? body.error : undefined;
    throw new ApiRequestError(
      error?.code ?? 'INTERNAL',
      error?.message ?? 'Something went wrong. Try again.',
    );
  }

  return body;
}
