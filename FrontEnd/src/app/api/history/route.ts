import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Prefer root-level historico.json (process.cwd()), but fallback to src/app/historico.json
const CANDIDATE_PATHS = [
  path.join(process.cwd(), 'historico.json'),
  path.join(process.cwd(), 'src', 'app', 'historico.json'),
];

async function findFilePath() {
  for (const p of CANDIDATE_PATHS) {
    try {
      await fs.access(p);
      return p;
    } catch {
      // not found, continue
    }
  }
  // If none exist, prefer root and ensure directories exist for fallback path
  const preferred = CANDIDATE_PATHS[0];
  // if preferred parent dir doesn't exist, try to create file at second candidate's dir
  try {
    // ensure directory for preferred exists (usually process.cwd())
    return preferred;
  } catch {
    return CANDIDATE_PATHS[1];
  }
}

async function ensureFile(pathToUse: string) {
  try {
    await fs.access(pathToUse);
    return true;
  } catch {
    try {
      // ensure parent directory exists
      const dir = path.dirname(pathToUse);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(pathToUse, JSON.stringify([], null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Failed to ensure historico.json exists at', pathToUse, err);
      return false;
    }
  }
}

async function readFileSafe() {
  try {
    const filePath = await findFilePath();
    await ensureFile(filePath);
    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('readFileSafe failed', err);
    return [];
  }
}

async function writeFileSafe(arr: unknown[]) {
  try {
    const filePath = await findFilePath();
    await ensureFile(filePath);
    await fs.writeFile(filePath, JSON.stringify(arr, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to write historico.json', err);
    return false;
  }
}

export async function GET() {
  const arr = await readFileSafe();
  return NextResponse.json(arr);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) return NextResponse.json({ message: 'Invalid body' }, { status: 400 });

    const { source, entry } = body as { source?: string; entry?: Record<string, unknown> };
    if (!source || !entry) return NextResponse.json({ message: 'source and entry required' }, { status: 400 });

    const arr = await readFileSafe();
    const when = new Date().toISOString();
    const item = { source, entry, when };
    arr.unshift(item);
    // limit to 500
    const ok = await writeFileSafe(arr.slice(0, 500));
    if (!ok) return NextResponse.json({ message: 'Failed to save' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/history error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
