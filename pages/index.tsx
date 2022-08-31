import type { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import React from 'react';

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <div className='flex h-screen w-[full] items-center justify-center'>
      {session ? (
        'Signed in as ' + session.user?.email
      ) : (
        <>
          <button
            className='h-[64px] w-[96px] bg-blue-700 '
            onClick={() => signIn()}
          >
            Sign in
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
