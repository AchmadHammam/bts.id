import { $Enums } from "@prisma/client";
import { DefaultUser, ISODateString, DefaultSession } from "next-auth";

declare module "next-auth" {
	interface DefaultUser {
		email?: string | null;
		phone?: string;
		session?: string;
	}
}

declare module "next-auth" {
	interface Session {
		user: DefaultSession["user"] & {
			userId?: string;
			email?: string | null;
			phone?: string;
		};
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		sub?: string;
		role?: $Enums.Role;
		phone?: string;
		userId?: string;
		iat?: number;
		exp?: number;
		jti?: string;
	}
}
