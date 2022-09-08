import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import React, { useState } from 'react';

import Divider from '../components/Divider';
import GoogleIcon from '../public/svgs/social/google.svg';
import TwitterIcon from '../public/svgs/social/twitter.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { status } = useSession();
  if (status === 'loading') {
    return (
      <div className='flex h-full min-h-screen w-full items-center justify-center'>
        Loading or not authenticated...
      </div>
    );
  }
  if (status === 'authenticated') {
    router.push('/');
  }
  return (
    <div className=' flex h-full min-h-screen w-full items-center justify-center '>
      <div className='flex items-center justify-center px-4  lg:px-0'>
        <div className='flex flex-col lg:min-w-[480px]'>
          <h1 className='bg-clip-text py-2 text-5xl font-semibold tracking-tighter text-transparent [background-image:linear-gradient(315deg,rgb(102,0,255)_0%,rgb(255,0,102)_100%)] lg:text-7xl'>
            Meeting up <br /> just got easier
          </h1>
          <button
            onClick={() =>
              signIn('google', {
                callbackUrl: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
              })
            }
            type='button'
            className='mr-2 mb-2 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-4 text-sm font-[600] text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200'
          >
            <GoogleIcon style={{ height: 24, width: 24 }} />
            <span className='ml-2'>Sign in with Google</span>
          </button>
          <button
            onClick={() =>
              signIn('twitter', {
                callbackUrl: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
              })
            }
            type='button'
            className='mr-2 mb-2 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-4 text-sm font-[600] text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200'
          >
            <TwitterIcon style={{ height: 24, width: 24 }} />
            <span className='ml-2'>Sign in with Twitter</span>
          </button>
          <Divider content='or' />
          <form
            onSubmit={() => {
              signIn('email', {
                email,
                callbackUrl: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
              });
            }}
          >
            <div className='flex flex-col gap-4'>
              <div>
                <label
                  htmlFor='email'
                  className='mb-2 block text-sm font-medium text-gray-900'
                >
                  Email address
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type='email'
                  name='email'
                  id='email'
                  className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                  placeholder='Enter your email'
                  required
                />
              </div>
              <button
                type='submit'
                className='rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-4 text-center text-sm font-semibold text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800'
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
