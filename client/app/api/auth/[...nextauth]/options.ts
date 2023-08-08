import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface LoginProps {
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: {
          label: "Email:",
          type: "email",
          placeholder: "Email",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        // logic for login / if the users exitsts
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        const { email, password } = credentials as LoginProps;

        const res = await fetch("http://localhost:10443/v1/login", {
          method: "POST",
          mode: "cors",
          cache: "no-store",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        const user = await res.json();

        if (!user) {
          throw new Error("No user found");
        }

        if (user.data.length !== 0 && user.resultCode !== 1) {
          return {
            id: user.data[0].pkey,
            email: user.data[0].email,
            name: user.data[0].name,
          };
        } else {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
      return token;
    },
    async session({ token, user, session }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
      //   return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/signin", // custom signin page
  },
};
