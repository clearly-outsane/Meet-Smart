import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';

const Home: NextPage = () => {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
      // The user is not authenticated, handle it here.
    },
  });

  if (status === 'loading') {
    return (
      <div className='flex h-full min-h-screen w-full items-center justify-center'>
        Loading or not authenticated...
      </div>
    );
  }

  return (
    <div className='flex h-screen w-[full] items-center justify-center'>
      <div className='flex flex-col items-center'>
        <div>Dashboard</div>
        <div>Signed in as {session.user?.email}</div>
        <button
          className='mt-4 h-[42px] w-[96px] bg-blue-700'
          onClick={() =>
            signOut({ callbackUrl: 'http://localhost:3000/login' })
          }
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Home;
