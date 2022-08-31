import create, { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserSlice {
  email: undefined | string;
}
const createUserSlice: StateCreator<
  UserSlice,
  [['zustand/persist', UserSlice | unknown]],
  [],
  UserSlice
> = (set) => ({
  email: undefined,
  signOut: () => set({ email: undefined }),
});

const useBoundStore = create<UserSlice>()(
  persist((...a) => ({
    ...createUserSlice(...a),
  }))
);

export default useBoundStore;
