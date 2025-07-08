import { NextResponse } from 'next/server';

const ASSEMBLY_AI_TOKEN = process.env.ASSEMBLY_AI_TOKEN;
const ASSEMBLY_API_URL = 'https://api.assemblyai.com/v2';

const STATUS_COMPLETED = 'completed';
const STATUS_FAILED = 'failed';

async function startTranscription(audioUrl: string) {
  const res = await fetch(`${ASSEMBLY_API_URL}/transcript`, {
    method: 'POST',
    headers: {
      'Authorization': ASSEMBLY_AI_TOKEN!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ audio_url: audioUrl }),
  });
  if (!res.ok) throw new Error('Failed to start transcription');
  return res.json();
}

async function pollTranscription(id: string, timeout = 60000, interval = 3000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    const res = await fetch(`${ASSEMBLY_API_URL}/transcript/${id}`, {
      headers: { 'Authorization': ASSEMBLY_AI_TOKEN! },
    });
    if (!res.ok) throw new Error('Failed to poll transcription');
    const data = await res.json();
    if (data.status === STATUS_COMPLETED) return data;
    if (data.status === STATUS_FAILED) throw new Error('Transcription failed');
    await new Promise(r => setTimeout(r, interval));
  }
  throw new Error('Transcription timed out');
}

export async function POST(req: Request) {
  try {
    const { audioUrl } = await req.json();
    if (!audioUrl) return NextResponse.json({ error: 'audioUrl required' }, { status: 400 });
    const start = await startTranscription(audioUrl);
    const result = await pollTranscription(start.id);
    return NextResponse.json({ text: result.text });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}
