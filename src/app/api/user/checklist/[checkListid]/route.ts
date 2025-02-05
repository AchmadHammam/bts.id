import { authOptions } from "@/lib/auth";
import prisma from "@/lib/database";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { checkListid: string } }) {
  const session = await getServerSession(authOptions);
  const checklistId = parseInt(params.checkListid);

  const check = await prisma.checklist.findFirst({
    where: {
      id: checklistId,
    },
  });
  if (!check) {
    return NextResponse.json(
      {
        error: true,
        message: null,
        data: "data tidak ditemukan",
      },
      {
        status: HttpStatusCode.BadRequest,
      }
    );
  }
  const done = !check.done;
  const data = await prisma.checklist.update({
    where: {
      id: checklistId,
    },
    data: {
      done: done,
      updatedBy: session?.user.name!,
    },
  });

  return NextResponse.json({
    error: false,
    message: null,
    data: data,
  });
}

export async function DELETE(request: NextRequest, { params }: { params: { checkListid: string } }) {
  const session = await getServerSession(authOptions);
  const checklistId = parseInt(params.checkListid);

  const check = await prisma.checklist.findFirst({
    where: {
      id: checklistId,
    },
  });
  if (!check) {
    return NextResponse.json(
      {
        error: true,
        message: null,
        data: "data tidak ditemukan",
      },
      {
        status: HttpStatusCode.BadRequest,
      }
    );
  }
  const done = !check.done;
  const data = await prisma.checklist.delete({
    where: {
      id: check.id,
    },
  });

  return NextResponse.json({
    error: false,
    message: null,
    data: data,
  });
}

export async function GET(request: NextRequest, { params }: { params: { checkListid: string } }) {
  const session = await getServerSession(authOptions);
  const checklistId = parseInt(params.checkListid);

  const check = await prisma.checklist.findFirst({
    where: {
      id: checklistId,
    },
  });
  if (!check) {
    return NextResponse.json(
      {
        error: true,
        message: null,
        data: "data tidak ditemukan",
      },
      {
        status: HttpStatusCode.BadRequest,
      }
    );
  }
  const done = !check.done;
  const data = await prisma.checklist.findFirst({
    where: {
      id: check.id,
    },
    include: {
      items: true,
    },
  });

  return NextResponse.json({
    error: false,
    message: null,
    data: data,
  });
}
