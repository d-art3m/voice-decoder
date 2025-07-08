import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return new NextResponse("Filename is required", { status: 400 });
  }

  if (!request.body) {
    return new NextResponse("Request body is empty", { status: 400 });
  }

  try {
    const blob = await put(filename, request.body, {
      access: 'public',
      addRandomSuffix: true,
    });
    return NextResponse.json(blob);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 