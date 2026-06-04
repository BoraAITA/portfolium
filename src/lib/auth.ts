import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar || user.image,
          username: user.username,
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { username: true, theme: true },
        });
        token.username = dbUser?.username;
        token.theme = dbUser?.theme;
      }

      if (trigger === "update" && session) {
        token.name = session.name;
        token.username = session.username;
        token.theme = session.theme;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string | undefined;
        session.user.theme = token.theme as string | undefined;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (existing) {
          const needsUsername =
            !existing.username || existing.username.length > 20;
          if (needsUsername) {
            const baseUsername = user.email
              .split("@")[0]
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "") || "user";
            let username = baseUsername;
            let counter = 1;
            while (await prisma.user.findUnique({ where: { username } })) {
              username = `${baseUsername}${counter}`;
              counter++;
            }
            await prisma.user.update({
              where: { id: existing.id },
              data: { username },
            });
          }
        }
      }
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      if (user.email) {
        const baseUsername =
          user.email
            .split("@")[0]
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "") || "user";
        let username = baseUsername;
        let counter = 1;
        while (await prisma.user.findUnique({ where: { username } })) {
          username = `${baseUsername}${counter}`;
          counter++;
        }
        await prisma.user.update({
          where: { id: user.id },
          data: { username },
        });
      }
    },
  },
};
