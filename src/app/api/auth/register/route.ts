import prisma from "@/lib/database";
import { CreateUserValidation } from "@/lib/schema/user";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = CreateUserValidation.safeParse(body);
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
  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: await bcrypt.hash(data!.password, 10)!,
      nama: data.nama,
      createdBy: data.username,
      updatedBy: data.username,
    },
  });
  return NextResponse.json({
    error: false,
    message: "berhasil register",
    data: user,
  });
}
