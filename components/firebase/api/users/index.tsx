/* eslint-disable no-console */
import {
  arrayUnion,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { User } from './types';
import { meetupId } from '../meetups/types';
import { db } from '../../index';

export const updateUser = async (fieldsToUpdate: User) => {
  const { uid, ...body } = fieldsToUpdate;
  try {
    const docRef = doc(db, 'users', uid);

    const docSnap = await getDoc(docRef);

    //if the user exists
    if (docSnap.exists()) {
      /**
       * if the meetups array exists, do a union
       * else create a new array property
       */
      if (docSnap.data().meetups) {
        await updateDoc(docRef, {
          ...body,
          meetups: arrayUnion(...(body.meetups as meetupId[])),
        });
      } else
        await updateDoc(docRef, {
          ...body,
        });
    } else {
      console.log('User not found');
    }
  } catch (e) {
    console.log('HERE', uid, body);
    console.error('Error adding document: ', e);
  }
};

export const getUserFromId = async (
  uid: string | undefined
): Promise<DocumentData | undefined> => {
  if (uid)
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else return undefined;
    } catch (e) {
      console.log(e);
    }
  else return undefined;
};

export const useOnUserSnapshot = (
  uid: string | undefined
): DocumentData | undefined => {
  const [user, setUser] = useState<DocumentData>();
  useEffect(() => {
    const unsub = uid
      ? onSnapshot(
          doc(db, 'users', uid),
          (doc) => {
            setUser(doc.data());
          },
          (error) => console.log(error)
        )
      : () => console.log('no uid');

    return () => {
      unsub();
    };
  }, [uid]);

  return user;
};
