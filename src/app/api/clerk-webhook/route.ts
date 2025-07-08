import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';

const EVENT_USER_CREATED = 'user.created';
const EVENT_USER_DELETED = 'user.deleted';

export async function POST(req: Request) {
  const event = await req.json();

  if (event.type === EVENT_USER_CREATED) {
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
      return NextResponse.json({ status: 'User already exists' });
    }
  }

  if (event.type === EVENT_USER_DELETED) {
    const user = event.data;
    try {
      const dbUser = await prisma.user.findUnique({ where: { clerkUserId: user.id } });
      if (dbUser) {
        await prisma.record.deleteMany({ where: { userId: dbUser.id } });
        await prisma.user.delete({ where: { id: dbUser.id } });
        return NextResponse.json({ status: 'User deleted' });
      } else {
        return NextResponse.json({ status: 'User not found' });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      return NextResponse.json({ status: 'error', error: errorMessage });
    }
  }

  return NextResponse.json({ status: 'ignored' });
} 