import { DocumentReference } from 'firebase/firestore';

export type Participant = {
  ref: DocumentReference;
  uid: string;
  image: string;
  name: string;
  address: { lat: string; lng: string };
};

export type MeetupType = {
  title: string;
  organiserRef: DocumentReference;
  dateCreated: Date;
  date?: Date;
  participants: Participant[];
};

export type newMeetupType = {
  [key in keyof MeetupType]: key extends 'participants'
    ? Omit<Participant, 'ref'>[]
    : MeetupType[key];
};
