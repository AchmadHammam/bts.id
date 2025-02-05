import { authOptions } from "@/lib/auth";
import prisma from "@/lib/database";
import { CreateTodolistValidation } from "@/lib/schema/todolist";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { fromZodError } from "zod-validation-error";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  const body = await request.json();
  const validation = CreateTodolistValidation.safeParse(body);

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
  const data = validation.data;
  console.log(session?.user!);

  const checklist = await prisma.checklist.create({
    data: {
      userId: parseInt(session?.user.userId!),
      title: data.title,
      createdBy: session?.user?.name!,
      updatedBy: session?.user?.name!,
    },
  });
  return NextResponse.json({
    error: false,
    message: "berhasil membuat checklist",
    data: checklist,
  });
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  var page: any = request.nextUrl.searchParams.get("page")!;
  var pageSize: any = request.nextUrl.searchParams.get("pageSize");
  var pageSizeInt = parseInt(pageSize);

  const checklist = await prisma.checklist.findMany({
    where: {
      userId: parseInt(session?.user.userId!),
    },
    select: {
      title: true,
      done: true,
      createdAt: true,
      updatedAt: true,
      Todolist: {
        select: {
          title: true,
          done: true,
          createdAt: true,
          updatedAt: true,
          items: {
            select: {
              item: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
    take: pageSizeInt,
    skip: (page - 1) * pageSize,
  });
  var count = await prisma.checklist.count({});

  var data = {
    count: count!,
    checklist: checklist!,
  };
  return NextResponse.json({
    error: false,
    message: null,
    data: data,
  });
}
