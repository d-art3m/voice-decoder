import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(req: Request) {
  const event = await req.json();

  if (event.type === 'user.created') {
    const user = event.data;
    try {
      await prisma.user.create({
        data: {
          clerkUserId: user.id,
          email: user.email_addresses?.[0]?.email_address || '',
          name: user.first_name || '',
        },
      });
      return NextResponse.json({ status: 'ok' });
    } catch (e) {
      return NextResponse.json({ status: 'already exists' });
    }
  }

  return NextResponse.json({ status: 'ignored' });
} 