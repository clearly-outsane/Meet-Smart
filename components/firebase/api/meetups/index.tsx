import { addDoc, collection, doc } from 'firebase/firestore';

import { MeetupType, newMeetupType, Participant } from './types';
import { db } from '../../index';

export const addMeetup = async (props: Omit<newMeetupType, 'organiserRef'>) => {
  //get ref for organiser. Organiser will always be first user
  const organiserRef = doc(db, 'users', props.participants[0].uid);

  //get refs for all the participants
  const filteredParticipants: Participant[] = [];
  props.participants.map((participant, _) => {
    const participantRef = doc(db, 'users', participant.uid);
    filteredParticipants.push({ ...participant, ref: participantRef });
  });

  const extendedProps: MeetupType = {
    ...props,
    organiserRef,
    participants: filteredParticipants,
  };

  const docRef = await addDoc(collection(db, 'meetups'), extendedProps);
  //   console.log('Document written with ID: ', docRef.id);
  return docRef;
};
