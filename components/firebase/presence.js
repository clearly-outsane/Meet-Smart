/* eslint-disable no-console */
import {
  getAuth,
  onAuthStateChanged,
  signInWithCustomToken,
} from 'firebase/auth';
import {
  onDisconnect,
  onValue,
  ref,
  serverTimestamp,
  set,
} from 'firebase/database';
import {
  doc,
  onSnapshot,
  serverTimestamp as firestoreTimeStamp,
  setDoc,
} from 'firebase/firestore';
import React from 'react';

import { db, realtimeDb } from './index';

const auth = getAuth();

const isOfflineForDatabase = {
  state: 'offline',
  last_changed: serverTimestamp(),
};

const isOnlineForDatabase = {
  state: 'online',
  last_changed: serverTimestamp(),
};

var isOfflineForFirestore = {
  state: 'offline',
  last_changed: firestoreTimeStamp(),
};

var isOnlineForFirestore = {
  state: 'online',
  last_changed: firestoreTimeStamp(),
};

export const useFirebaseAuthentication = (status, session) => {
  const [onlineStatus, setOnlineStatus] = React.useState(false);
  React.useEffect(() => {
    session?.customToken && signInWithCustomToken(auth, session?.customToken);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userStatusFirestoreRef = doc(db, '/status/' + uid);

        console.log('Firebase - signed in');
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        const userStatusDatabaseRef = ref(realtimeDb, '/status/' + uid);
        onValue(ref(realtimeDb, '.info/connected'), (snapshot) => {
          if (snapshot.val() == false) {
            // Instead of simply returning, we'll also set Firestore's state
            // to 'offline'. This ensures that our Firestore cache is aware
            // of the switch to 'offline.'
            setDoc(userStatusFirestoreRef, isOfflineForFirestore);

            return;
          }
          onDisconnect(userStatusDatabaseRef)
            .set(isOfflineForDatabase)
            .then(function () {
              // The promise returned from .onDisconnect().set() will
              // resolve as soon as the server acknowledges the onDisconnect()
              // request, NOT once we've actually disconnected:
              // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

              // We can now safely set ourselves as 'online' knowing that the
              // server will mark us as offline once we lose connection.
              set(userStatusDatabaseRef, isOnlineForDatabase);
              // We'll also add Firestore set here for when we come online.
              setDoc(userStatusFirestoreRef, isOnlineForFirestore);
            });
        });

        onSnapshot(userStatusFirestoreRef, (doc) => {
          // eslint-disable-next-line unused-imports/no-unused-vars
          var isOnline = doc.data().state == 'online';
          setOnlineStatus(true);
        });
      } else {
        console.log('User is signed out');
      }
    });
    return () => {
      unsubscribe();
    };
  }, [status, session]);

  return onlineStatus;
};
