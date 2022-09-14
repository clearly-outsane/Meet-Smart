/* eslint-disable unused-imports/no-unused-vars */
import { FirestoreAdapter } from '@next-auth/firebase-adapter';
import NextAuth, { Session } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),
    EmailProvider({
      server: {
        host: process.env.NEXT_PUBLIC_EMAIL_SERVER_HOST,
        port: process.env.NEXT_PUBLIC_EMAIL_SERVER_PORT,
        auth: {
          user: process.env.NEXT_PUBLIC_EMAIL_SERVER_USER,
          pass: process.env.NEXT_PUBLIC_EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.NEXT_PUBLIC_EMAIL_FROM,
    }),
    TwitterProvider({
      clientId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_TWITTER_CLIENT_SECRET as string,
    }),
  ],
  adapter: FirestoreAdapter({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    authDomain: 'meetsmart-360014.firebaseapp.com',
    projectId: 'meetsmart-360014',
    storageBucket: 'meetsmart-360014.appspot.com',
    messagingSenderId: '277756892625',
    appId: '1:277756892625:web:9758c0e665da605bf43cf0',
    measurementId: 'G-T5MKNY6Q6K',
  }),
  callbacks: {
    async session({ session, user, token }) {
      session = {
        ...session,
        user: {
          id: user.id,
          ...session.user,
        },
      } as Session & {
        user?: {
          name?: string | null;
          email?: string | null;
          image?: string | null;
          id?: string;
        };
      };
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log('jwt', user, token, account, profile);
      return token;
    },
  },
});
