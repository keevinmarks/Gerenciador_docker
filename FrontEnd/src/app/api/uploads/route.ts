import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const p = url.searchParams.get('path') || url.searchParams.get('p');
    if (!p) return NextResponse.json({ success: false, message: 'path required' }, { status: 400 });

    const backendUrl = `http://api:3001/${p}`;
    const res = await fetch(backendUrl);
    if (!res.ok) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: res.status });
    }

    const headers: Record<string, string> = {};
    const contentType = res.headers.get('content-type');
    if (contentType) headers['Content-Type'] = contentType;

    const body = await res.arrayBuffer();
    return new Response(body, { status: res.status, headers });
  } catch (err) {
    console.error('Error proxying upload:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
