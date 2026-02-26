// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type AuthOptions, type User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Extend the JWT & Session types so TypeScript knows about `role`
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: Role;
    };
  }

  interface user extends NextAuthUser {
    id: string;
    role: Role;
  }

  interface JWT {
    id: string;
    role: Role;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Only allow admin users to login here
        if (!user || user.role !== Role.ADMIN) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // Return user object for JWT
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, // ✅ Role enum
        };
      },
    }),
  ],

  session: { strategy: "jwt" as const },

  pages: { signIn: "/admin/login" },

  callbacks: {
    // Add role to JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as Role; // ✅ Cast to Role enum
      }
      return token;
    },

    // Add role to session.user
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role; // ✅ Cast to Role enum
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };