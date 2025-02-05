import { authOptions } from "@/lib/auth";
import prisma from "@/lib/database";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { checkListid: string } }) {
  const session = await getServerSession(authOptions);
  const checklistId = parseInt(params.checkListid);

  var page: any = request.nextUrl.searchParams.get("page")!;
  var pageSize: any = request.nextUrl.searchParams.get("pageSize");
  var pageSizeInt = parseInt(pageSize);

  const checklist = await prisma.todolist.findMany({
    where: {
      id: checklistId,
    },
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
    take: pageSizeInt,
    skip: (page - 1) * pageSize,
  });

  return NextResponse.json({
    error: false,
    message: null,
    data: checklist,
  });
}
