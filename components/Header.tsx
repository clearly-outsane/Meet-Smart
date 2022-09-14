import Image from 'next/image';
import { signOut } from 'next-auth/react';
import React, { useState } from 'react';

import { ExtendedSession } from '../types/session';

const Header = ({ session }: { session: ExtendedSession | null }) => {
  const [show, setShow] = useState(false);

  return (
    <div className=' w-full bg-transparent'>
      <div className='container relative mx-auto flex items-center justify-between py-14 px-4 lg:px-0'>
        <span>Meet Smart</span>
        <div className='relative'>
          <span
            onClick={() => setShow(true)}
            className='relative grid h-[32px] w-[32px] cursor-pointer place-items-center overflow-hidden rounded-full'
          >
            {session?.user?.image ? (
              <Image
                src={session.user?.image}
                alt='user image'
                layout='fill'
                objectFit='cover'
              />
            ) : (
              session?.user?.name ?? 'Account'
            )}
          </span>
          <div
            className={`${
              show ? '' : 'hidden'
            } absolute right-0 top-12 z-[2] flex min-w-[120px] flex-col rounded-lg bg-[#FBFBFB] [&>*]:px-2 [&>*]:py-2`}
          >
            <a className='text-gray-400'>Account</a>
            <button className='text-left' onClick={() => signOut()}>
              Sign out
            </button>
          </div>
          <div
            className={`${
              show ? '' : 'hidden'
            } fixed bottom-0 left-0 right-0 top-0 z-[1]`}
            onClick={() => setShow(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
