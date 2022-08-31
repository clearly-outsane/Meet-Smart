import { FirestoreAdapter } from '@next-auth/firebase-adapter';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
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
});
