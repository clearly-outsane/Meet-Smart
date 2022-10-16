import create, { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

import { MeetupType } from '../components/firebase/api/meetups/types';
import { User } from '../components/firebase/api/users/types';

type UserSlice = Omit<User, 'uid' | 'meetups'> & {
  uid: undefined | string;
  updateUser: (user: Partial<User>) => void;
  meetups: (MeetupType & { organiser: User })[];
  signOut: () => void;
};

const createUserSlice: StateCreator<
  UserSlice & GoogleMapsSlice,
  [['zustand/persist', UserSlice | GoogleMapsSlice | unknown]],
  [],
  UserSlice
> = (set) => ({
  email: undefined,
  uid: undefined,
  image: undefined,
  emailVerified: null,
  name: undefined,
  meetups: [],
  updateUser: (user: Partial<Omit<User, 'meetups'>>) => set({ ...user }),
  signOut: () =>
    set({
      email: undefined,
      uid: undefined,
      image: undefined,
      emailVerified: null,
      name: undefined,
      meetups: [],
    }),
});

interface GoogleMapsSlice {
  nearbyPlaces: google.maps.places.PlaceResult[];
  addNearbyPlaces: (nearbyPlaces: google.maps.places.PlaceResult[]) => void;
  activePlaceId?: string;
}
const createGoogleMapsSlice: StateCreator<
  UserSlice & GoogleMapsSlice,
  [['zustand/persist', UserSlice | GoogleMapsSlice | unknown]],
  [],
  GoogleMapsSlice
> = (set) => ({
  nearbyPlaces: [],
  addNearbyPlaces: (nearbyPlaces) => {
    set((prev) => {
      return {
        nearbyPlaces: [...prev.nearbyPlaces, ...nearbyPlaces],
      };
    });
  },
  activePlaceId: undefined,
});

const useBoundStore = create<UserSlice & GoogleMapsSlice>()(
  persist((...a) => ({
    ...createUserSlice(...a),
    ...createGoogleMapsSlice(...a),
  }))
);

export default useBoundStore;
