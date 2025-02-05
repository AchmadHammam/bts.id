import { authOptions } from "@/lib/auth";
import prisma from "@/lib/database";
import { CreateTodolistValidation } from "@/lib/schema/todolist";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { fromZodError } from "zod-validation-error";

export async function POST(request: NextRequest, { params }: { params: { checkListid: string } }) {
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

  const todolist = await prisma.todolist.create({
    data: {
      checklistId: parseInt(params.checkListid),
      title: data.title,
      createdBy: session?.user?.name!,
      updatedBy: session?.user?.name!,
    },
    include: {
      checklist: true,
    },
  });
  return NextResponse.json({
    error: false,
    message: "berhasil membuat todolist",
    data: todolist,
  });
}
