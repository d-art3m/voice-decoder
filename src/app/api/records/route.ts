import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const records = await prisma.record.findMany({
      where: { userId: user.id },
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
    const { title, audioUrl, decodedText } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }
    const recordCount = await prisma.record.count({ where: { userId: user.id } });
    if (recordCount >= 2 && !user.isPaid) {
      return new NextResponse("Payment required", { status: 402 });
    }

    const record = await prisma.record.create({
      data: {
        userId: user.id,
        title,
        audioUrl,
        decodedText,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.log("[RECORDS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    const { id } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!id) {
      return new NextResponse("Record id is required", { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    await prisma.record.delete({
      where: { id, userId: user.id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[RECORDS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    const { id, decodedText } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!id) {
      return new NextResponse("Record ID is required", { status: 400 });
    }

    if (!decodedText) {
      return new NextResponse("Decoded text is required", { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const updatedRecord = await prisma.record.update({
      where: { id, userId: user.id },
      data: { decodedText },
    });

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.log("[RECORDS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 