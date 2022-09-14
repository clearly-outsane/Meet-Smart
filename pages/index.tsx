import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { AiOutlinePlus } from 'react-icons/ai';

import { addMeetup } from '../components/firebase/api/meetups';
import { updateUser } from '../components/firebase/api/users';
import { User } from '../components/firebase/api/users/types';
import GoogleAutocomplete from '../components/GoogleAutocomplete';
import Header from '../components/Header';
import Input from '../components/Input';
import { ExtendedSession } from '../types/session';

const tabLabels = ['meetups', 'invites'];

const Home: NextPage = () => {
  const [tab, setTab] = useState(0);
  const router = useRouter();
  const {
    status,
    data: session,
  }: { status: string; data: ExtendedSession | null } = useSession({
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
      <div className='group relative w-full cursor-pointer sm:aspect-square sm:w-[240px]'>
        <div className='absolute -inset-1 rounded-lg bg-gradient-to-r from-[#8CD4FF] to-[#E49FFB] opacity-0 blur transition duration-300 group-hover:opacity-25'></div>
        <div className='relative flex h-full w-full flex-col rounded-xl bg-[#FEFEFE] p-6'>
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
    const [visible, setVisible] = useState(false);
    const [coordinates, setCoordinates] = useState<{
      lat: string;
      lng: string;
    }>({ lat: '', lng: '' });
    const {
      control,
      formState: { errors },
      handleSubmit,
    } = useForm({
      mode: 'onChange',
    });

    const createMeetup = async (data: FieldValues) => {
      const meetupDocRef = await addMeetup({
        title: data.title,
        dateCreated: new Date(),
        participants: [
          {
            uid: session?.user?.id as string,
            image: session?.user?.image ?? '',
            name: session?.user?.name ?? '',
            address: { ...coordinates },
          },
        ],
      });
      const updateFields: User = {
        uid: session?.user?.id as string,
        meetups: [meetupDocRef],
      };
      await updateUser(updateFields);
    };

    return (
      <>
        <button
          onClick={() => setVisible(true)}
          className=' group relative aspect-square sm:w-[240px]'
        >
          <div className='grid h-full w-full cursor-pointer place-items-center rounded-xl bg-[rgba(184,223,246,0.23)] p-6 font-semibold text-blue-600 hover:bg-[rgba(184,223,246,0.45)]'>
            <div className='flex flex-col items-center'>
              <div className='mb-4 grid h-10 w-10 place-items-center rounded-full bg-white '>
                <AiOutlinePlus />
              </div>
              <span> Create Meetup</span>
            </div>
          </div>
        </button>

        <div
          className={`fixed inset-0 z-10 ${
            visible ? '' : 'hidden'
          } grid place-items-center`}
          aria-labelledby='modal-title'
          role='dialog'
          aria-modal='true'
        >
          {/* <!--
              Background backdrop, show/hide based on modal state.

            Entering: "ease-out duration-300"
              From: "opacity-0"
              To: "opacity-100"
            Leaving: "ease-in duration-200"
              From: "opacity-100"
              To: "opacity-0"
            --> */}
          <div
            onClick={() => setVisible(false)}
            className='fixed inset-0 bg-[rgba(236,246,250,0.6)] bg-opacity-75 transition-opacity [backdrop-filter:blur(4px)]'
          ></div>

          {/* <!--
              Modal panel, show/hide based on modal state.

              Entering: "ease-out duration-300"
                From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                To: "opacity-100 translate-y-0 sm:scale-100"
              Leaving: "ease-in duration-200"
                From: "opacity-100 translate-y-0 sm:scale-100"
                To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            --> */}
          <div className='relative w-full transform transition-all sm:my-8 sm:max-w-lg '>
            <form
              onSubmit={handleSubmit((data) => createMeetup(data))}
              className='relative mx-4 flex flex-col rounded-lg bg-white p-8 text-left '
            >
              <h2 className=''>Create a new meetup</h2>

              <div className='relative my-4 flex flex-col gap-2'>
                <Controller
                  control={control}
                  name='title'
                  rules={{ required: 'This field is required' }}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Input
                        value={value}
                        onChange={onChange}
                        label='Title'
                        placeholder='Name your meetup'
                        error={errors?.title?.message ?? null}
                      />
                    );
                  }}
                />
                <Controller
                  control={control}
                  name='address'
                  rules={{ required: 'This field is required' }}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <GoogleAutocomplete
                        value={value}
                        onChange={onChange}
                        label='Your Address'
                        placeholder='Where are you traveling from?'
                        error={errors?.address?.message ?? null}
                        getCoordinates={({ lat, lng }) =>
                          setCoordinates({ lat: String(lat), lng: String(lng) })
                        }
                      />
                    );
                  }}
                />
              </div>
              <button
                type='submit'
                className='rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-4 text-center text-sm font-semibold text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800'
              >
                Create Meetup
              </button>
            </form>
          </div>
        </div>
      </>
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
                className={`text-2xl font-semibold capitalize sm:text-3xl ${
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
          <EventCard /> <EventCard />
        </div>
      </div>
    </div>
  );
};

export default Home;
