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
    const { title, audioUrl, decodedText } = await req.json();

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

    await prisma.record.delete({
      where: { id, userId },
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

    const updatedRecord = await prisma.record.update({
      where: { id, userId },
      data: { decodedText },
    });

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.log("[RECORDS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 