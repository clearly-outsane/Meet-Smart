/* eslint-disable no-console */
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';

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
