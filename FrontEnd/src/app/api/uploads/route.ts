import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

function contentTypeFromName(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const p = url.searchParams.get('path') || url.searchParams.get('p');
    if (!p) return NextResponse.json({ success: false, message: 'path required' }, { status: 400 });

    // Try local filesystem first (common candidate locations)
    try {
      const filename = path.basename(p);
      const candidates = [
        path.join(process.cwd(), p),
        path.join(process.cwd(), 'uploads', filename),
        path.join(process.cwd(), 'public', p),
        path.join(process.cwd(), '..', p),
        path.join(process.cwd(), '..', 'uploads', filename),
        path.join(process.cwd(), '..', 'BackEnd', p),
        path.join(process.cwd(), '..', 'BackEnd', 'uploads', filename),
      ];

      for (const candidate of candidates) {
        try {
          // check file exists
          await fs.stat(candidate);
          const data = await fs.readFile(candidate);
          const uint8 = new Uint8Array(data.length);
          for (let i = 0; i < data.length; i++) uint8[i] = data[i];
          const blob = new Blob([uint8]);
          const headers: Record<string, string> = {
            'Content-Type': contentTypeFromName(candidate),
          };
          return new Response(blob, { status: 200, headers });
        } catch {
          // ignore and try next
        }
      }
    } catch {
      // continue to proxy if local read fails
    }

    // fallback: proxy to backend
    const backendUrl = `http://api:3001/${p}`;
    const res = await fetch(backendUrl);
    if (!res.ok) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: res.status });
    }

    const headers: Record<string, string> = {};
    const contentType = res.headers.get('content-type');
    if (contentType) headers['Content-Type'] = contentType;

    const body = await res.arrayBuffer();
    return new NextResponse(body, { status: res.status, headers });
  } catch (err) {
    console.error('Error proxying upload:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
