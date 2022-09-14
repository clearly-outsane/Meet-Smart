import { DocumentReference, Timestamp } from 'firebase/firestore';

export type User = {
  email?: string;
  uid: string;
  image?: string;
  emailVerified?: Timestamp | null;
  name?: string;
  meetups?: DocumentReference[];
};
