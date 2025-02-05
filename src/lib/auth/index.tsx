import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import moment from "moment-timezone";
import bcrypt from "bcrypt";
import prisma from "../database";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 365 * 24 * 60 * 60,
  },
  pages: {
    signIn: `${process.env.APP_URL}/`,
    signOut: `/`,
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.username && !credentials!.password) {
          return null;
        }
        var user = await prisma.user.findFirst({
          where: {
            username: credentials?.username,
          },
        });
        console.log(user);

        if (user) {
          var compareHash = await bcrypt.compare(credentials?.password!.trim()!, user!.password.trim());
          if (compareHash) {
            return {
              id: user.id.toString(),
              name: user.nama,
              email: user.email,
            };
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    jwt: ({ token, user }) => {
      console.log("JWT callback:", user);
      if (user) {
        return {
          ...token,
          userId: user.id!,
          name: user.name!,
          email: user.email!,
        };
      } else {
        return token;
      }
    },
    session: ({ session, token, user }) => {
      console.log("Session callback:", token);
      return {
        ...session,
        user: {
          userId: token.userId!,
          name: token.name!,
          email: token.email!,
        },
      };
    },
  },
};
