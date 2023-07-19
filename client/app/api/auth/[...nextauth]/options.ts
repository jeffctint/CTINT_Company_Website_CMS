
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            type: "credentials",
            credentials: {
                email: {
                    label: "Email:",
                    type: "email",
                    placeholder: "Email"
                },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "Password"
                }
            },
            async authorize(credentials) {
                // logic for login / if the users exitsts
                const {email, password} = credentials as {email: string, password: string}

                const user = { id: "1", email: "jeff@ctint.com", password: "1234"}
                if(email !== 'jeff@ctint.com' || password !== '1234') {
                    throw new Error('Invalid credentials')
                }
               
                return user
            },
        })
    ],
    secret: process.env.NEXTAUTH_SECRET!,
    session: {
        strategy: "jwt"
    },
    debug: process.env.NODE_ENV === "development",
    pages: {
        signIn: "/signin", // custom signin page
        
    }
}

