import { authOptions } from "@/lib/auth";
import prisma from "@/lib/database";
import { CreateTodolistValidation, ItemsValidatidation } from "@/lib/schema/todolist";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { fromZodError } from "zod-validation-error";

export async function POST(request: NextRequest, { params }: { params: { checkListid: string; totdolist: string } }) {
  const session = await getServerSession(authOptions);

  const body = await request.json();
  const validation = ItemsValidatidation.safeParse(body);

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

  const items = await prisma.items.create({
    data: {
      todolistId: parseInt(params.checkListid),
      item: data.items,
      createdBy: session?.user?.name!,
      updatedBy: session?.user?.name!,
    },
  });
  return NextResponse.json({
    error: false,
    message: "berhasil membuat checklist",
    data: items,
  });
}
