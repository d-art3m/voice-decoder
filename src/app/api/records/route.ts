import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const records = await prisma.record.findMany({
      where: { userId },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.log("[RECORDS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { title, audioUrl } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const record = await prisma.record.create({
      data: {
        userId,
        title,
        audioUrl,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.log("[RECORDS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 