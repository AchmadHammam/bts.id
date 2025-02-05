import prisma from "@/lib/database";
import { LoginValidation } from "@/lib/schema/login";
import { HttpStatusCode } from "axios";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function POST(request: NextRequest) {
  var date = moment.tz("Asia/Jakarta");

  var body = await request.json();
  const baseUrl = process.env.LOGIN_URL;
  var validation = LoginValidation.safeParse(body);
  if (validation.error) {
    return NextResponse.json({
      error: true,
      message: null,
      data: fromZodError(validation.error),
    });
  }
  var data = validation.data;

  // create csrfToken untuk login
  const csrfApiResponse = await fetch(`${baseUrl}/api/auth/csrf`);
  const csrfSetCookiesWithOptions = csrfApiResponse.headers.getSetCookie();
  const setCookiesArray = [...csrfSetCookiesWithOptions];
  const setCookiesKeyValue = setCookiesArray
    .map((cookie) => cookie.split(";")[0]) // we only want the key value pair, not the options
    .join("; ");
  const csrfAuthToken: string = (await csrfApiResponse.json()).csrfToken;
  //@ts-expect-error
  var params = new URLSearchParams({
    username: data.username.trim(),
    password: data.password.trim(),
    csrfToken: csrfAuthToken,
    json: true,
  });

  //login
  const signInUrl = `${baseUrl}/api/auth/callback/credentials`;
  const res = await fetch(signInUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      cookie: setCookiesKeyValue,
    },
    body: params,
  });

  if (!res.ok) {
    return NextResponse.json(
      {
        error: true,
        message: "Unauthorized",
        data: null,
      },
      { status: res.status }
    );
  }
  var token = res.headers.getSetCookie();
  csrfSetCookiesWithOptions.push(token[0]);
  return NextResponse.json(
    {
      error: false,
      message: null,
      data: {
        csrfToken: csrfSetCookiesWithOptions[0].split("next-auth.csrf-token=")[1].split(";")[0],
        callback: csrfSetCookiesWithOptions[1].split("next-auth.callback-url=")[1].split(";")[0],
        token: csrfSetCookiesWithOptions[2].split("next-auth.session-token=")[1].split(";")[0],
        expireToken: csrfSetCookiesWithOptions[2].split("Expires=")[1].split(";")[0],
      },
    },
    { status: res.status }
  );
}
