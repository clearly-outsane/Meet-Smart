import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
} from 'firebase/firestore';

import { MeetupType } from './types';
import { db } from '../../index';

export const addMeetup = async (props: MeetupType) => {
  //get ref for organiser. Organiser will always be first user

  const docRef = await addDoc(collection(db, 'meetups'), props);
  //   console.log('Document written with ID: ', docRef.id);
  return docRef;
};

export const getMeetupFromRef = async (
  docRef: DocumentReference
): Promise<DocumentSnapshot | undefined> => {
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    {
      return docSnap;
    }
  } else return undefined;
};

export const getMeetupFromId = async (
  id: string
): Promise<DocumentData | undefined> => {
  const docRef = doc(db, 'meetups', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const serializedData = {
      ...docSnap.data(),
      dateCreated: docSnap.data().dateCreated.toDate().toJSON(),
    };
    {
      return serializedData;
    }
  } else return undefined;
};
