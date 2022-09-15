import { userId } from './../users/types';
export type Participant = {
  image: string;
  name: string;
  address: { lat: string; lng: string };
};

export type meetupId = string;

export type MeetupType = {
  id?: string;
  title: string;
  organiserId: userId;
  dateCreated: Date;
  date?: Date;
  participants: { [id: string]: Participant };
};
