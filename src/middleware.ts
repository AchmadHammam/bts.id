import { NextFetchEvent, NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { HttpStatusCode } from "axios";

export default async function middleware(req: NextRequestWithAuth, event: NextFetchEvent) {
  const token = await getToken({ req });

  const authMiddleware = withAuth({
    pages: {
      signIn: `/`,
      signOut: `/`,
    },
  });
  console.log("middleware token", token);

  if (!token) {
    return NextResponse.json(
      {
        error: true,
        message: "Unauthorized",
        data: null,
      },
      { status: HttpStatusCode.Unauthorized }
    );
  }

  return authMiddleware(req, event);
}
export const config = {
  matcher: ["/api/user/:path*"],
};
