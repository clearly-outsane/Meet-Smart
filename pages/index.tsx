import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

import Header from '../components/Header';

const tabLabels = ['My events', 'invites'];

const Home: NextPage = () => {
  const [tab, setTab] = useState(0);
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

  const EventCard = () => {
    return (
      <div className=' group relative aspect-square cursor-pointer lg:w-[240px]'>
        <div className='group-hover:opacity-1 absolute -inset-1 z-[-1] rounded-lg bg-gradient-to-r from-[#8CD4FF] to-[#E49FFB] opacity-0 blur transition duration-300'></div>
        <div className='flex h-full w-full flex-col rounded-xl bg-[#FEFEFE] p-6'>
          <div className='mb-4 flex items-center'>
            <div className='h-8 w-8 overflow-hidden rounded-full bg-yellow-200'></div>
            <div className='ml-2 flex flex-col'>
              <span className='text-sm font-semibold'>Vinay S</span>
              <span className='text-xs'>Organiser</span>
            </div>
          </div>
          <span className=' text-lg font-semibold line-clamp-2'>
            Friday game night with the bois
          </span>
          <div className='mt-12 flex items-center justify-between'>
            <div className='flex -space-x-4'>
              <div className=' h-8 w-8 rounded-full border-2 border-white bg-yellow-300'></div>
              <div className=' h-8 w-8 rounded-full border-2 border-white bg-blue-300'></div>
              <div className=' h-8 w-8 rounded-full border-2 border-white bg-pink-300'></div>
              <a
                className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-50 text-xs font-medium  hover:bg-gray-200'
                href='#'
              >
                +2
              </a>
            </div>
            <span className='text-sm text-gray-400'>Tomorrow</span>
          </div>
        </div>
      </div>
    );
  };

  const CreateMeetup = () => {
    return (
      <div className=' group relative aspect-square lg:w-[240px]'>
        <div className='grid h-full w-full cursor-pointer place-items-center rounded-xl bg-[rgba(184,223,246,0.23)] p-6 font-semibold text-blue-600 hover:bg-[rgba(184,223,246,0.45)]'>
          <div className='flex flex-col items-center'>
            <div className='mb-4 grid h-10 w-10 place-items-center rounded-full bg-white'>
              <AiOutlinePlus />
            </div>
            <span> Create Meetup</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='flex min-h-screen w-[full] flex-col items-center bg-[#FBFBFB] [background-image:radial-gradient(at_150%_83%,_hsla(285,100%,87%,0.5)_0px,_transparent_50%),radial-gradient(at_80%_54%,_hsla(203,100%,86%,0.5)_0px,_transparent_70%)]'>
      <Header session={session} />
      <div className='container mx-auto grid items-center px-4 lg:px-0'>
        <div className='flex gap-12 py-8'>
          {tabLabels.map((tabLabel, i) => (
            <button onClick={() => setTab(i)} key={i}>
              <span
                className={`text-3xl font-semibold capitalize ${
                  i == tab ? 'text-blue-400' : 'text-gray-300'
                }`}
              >
                {tabLabel}
              </span>
            </button>
          ))}
        </div>
        <div className='flex w-full flex-wrap gap-8'>
          <CreateMeetup />
          <EventCard />
        </div>
      </div>
    </div>
  );
};

export default Home;
