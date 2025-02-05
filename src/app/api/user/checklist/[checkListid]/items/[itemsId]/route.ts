import { authOptions } from "@/lib/auth";
import prisma from "@/lib/database";
import { ItemsValidatidation } from "@/lib/schema/todolist";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { fromZodError } from "zod-validation-error";

export async function PUT(request: NextRequest, { params }: { params: { checkListid: string; itemsId: string } }) {
  const session = await getServerSession(authOptions);

  const check = await prisma.items.findFirst({
    where: {
      id: parseInt(params.itemsId),
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
  const data = await prisma.items.update({
    where: {
      id: parseInt(params.itemsId),
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

export async function GET(request: NextRequest, { params }: { params: { checkListid: string; itemsId: string } }) {
  const session = await getServerSession(authOptions);

  const check = await prisma.items.findFirst({
    where: {
      id: parseInt(params.itemsId),
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
  const data = await prisma.items.findFirst({
    where: {
      id: parseInt(params.itemsId),
    },
  });

  return NextResponse.json({
    error: false,
    message: null,
    data: data,
  });
}

export async function DELETE(request: NextRequest, { params }: { params: { checkListid: string; itemsId: string } }) {
  const session = await getServerSession(authOptions);

  const check = await prisma.items.findFirst({
    where: {
      id: parseInt(params.itemsId),
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
  const data = await prisma.items.delete({
    where: {
      id: parseInt(params.itemsId),
    },
  });

  return NextResponse.json({
    error: false,
    message: null,
    data: data,
  });
}

export async function PATCH(request: NextRequest, { params }: { params: { checkListid: string; itemsId: string } }) {
  const session = await getServerSession(authOptions);
  const body = await request.json();

  const validation = ItemsValidatidation.safeParse(body);

  const check = await prisma.items.findFirst({
    where: {
      id: parseInt(params.itemsId),
    },
  });
  if (validation.success == false) {
    const validationError = fromZodError(validation.error);
    return NextResponse.json(
      {
        error: true,
        message: null,
        data: validationError,
      },
      {
        status: HttpStatusCode.UnprocessableEntity,
      }
    );
  }
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
  const data = await prisma.items.update({
    where: {
      id: parseInt(params.itemsId),
    },
    data: {
      item: validation.data.items,
      updatedBy: session?.user.name!,
    },
  });

  return NextResponse.json({
    error: false,
    message: null,
    data: data,
  });
}
