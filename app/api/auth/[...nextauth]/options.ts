/* eslint-disable */
// @ts-nocheck
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { query } from "@/config"; // Assuming you have a database query function


// Define the auth options with explicit type assertions
export const authOptions: NextAuthOptions  = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing Credentials");
        }

        try {
          // Query to find user by email using the query function from config
          const result = await query<
            {
              id: number;
              email: string;
              password: string;
              name: string;
              bio: string;
            }[]
          >(
            "SELECT id, email, password, name, bio FROM users WHERE email = ?",
            [credentials.email]
          );

          const user = result[0];

          // If user is not found, return null
          if (!user) {
            throw new Error("Email not found");
          }

          // Compare hashed password with the provided password
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          // If passwords match, return user object with name and bio
          if (passwordMatch) {
            return {
              id: String(user.id),
              email: user.email,
              name: user.name,
              bio: user.bio,
            };
          }

          // If password does not match, return null
          throw new Error("Invalid password");
        } catch (error) {
          console.error(error);
          throw new Error("Unknown error occurred");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Session strategy should be "jwt"
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.bio = user.bio;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.bio = token.bio as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
};
