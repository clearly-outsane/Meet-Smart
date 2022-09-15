import { Timestamp } from 'firebase/firestore';

import { meetupId } from '../meetups/types';

export type userId = string;

export type User = {
  email?: string;
  uid: userId;
  image?: string;
  emailVerified?: Timestamp | null;
  name?: string;
  meetups?: meetupId[];
};
