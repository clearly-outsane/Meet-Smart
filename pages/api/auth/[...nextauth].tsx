/* eslint-disable unused-imports/no-unused-vars */
import { FirestoreAdapter } from '@next-auth/firebase-adapter';
import admin from 'firebase-admin';
import NextAuth, { Session } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_ADMIN_CONFIG_type,
      project_id: process.env.FIREBASE_ADMIN_CONFIG_project_id,
      private_key_id: process.env.FIREBASE_ADMIN_CONFIG_private_key_id,
      private_key: process.env.FIREBASE_ADMIN_CONFIG_private_key?.replace(
        /\\n/gm,
        '\n'
      ), // https://github.com/gladly-team/next-firebase-auth/discussions/95#discussioncomment-473663
      client_email: process.env.FIREBASE_ADMIN_CONFIG_client_email,
      client_id: process.env.FIREBASE_ADMIN_CONFIG_client_id,
      auth_uri: process.env.FIREBASE_ADMIN_CONFIG_auth_uri,
      token_uri: process.env.FIREBASE_ADMIN_CONFIG_token_uri,
      auth_provider_x509_cert_url:
        process.env.FIREBASE_ADMIN_CONFIG_auth_provider_x509_cert_url,
      client_x509_cert_url:
        process.env.FIREBASE_ADMIN_CONFIG_client_x509_cert_url,
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_REALTIME_DATABASE_URL,
  });
}

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
      const customToken =
        token?.customToken ??
        (await admin.auth().createCustomToken(user.id, {}));
      session = {
        ...session,
        user: {
          id: user.id,
          ...session.user,
        },
        customToken,
      } as Session & {
        user?: {
          name?: string | null;
          email?: string | null;
          image?: string | null;
          id?: string;
        };
        customToken: string;
      };

      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (isNewUser || user) {
        const customToken = await admin.auth().createCustomToken(token.sub, {});
        token.customToken = customToken;
      }
      return token;
    },
  },
});
