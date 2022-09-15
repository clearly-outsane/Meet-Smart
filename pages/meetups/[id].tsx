/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-console */
import { DocumentData } from 'firebase/firestore';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { getMeetupFromId } from '../../components/firebase/api/meetups';
import Header from '../../components/Header';
import { ExtendedSession } from '../../types/session';

const Meetup: NextPage<{ data: DocumentData }> = ({ data }) => {
  const router = useRouter();
  const { id } = router.query;

  const {
    status,
    data: session,
  }: { status: 'loading' | 'authenticated'; data: ExtendedSession | null } =
    useSession({
      required: true,
      onUnauthenticated() {
        router.push('/login');
        // The user is not authenticated, handle it here.
      },
    });

  useEffect(() => {
    console.log(data);
  }, []);

  if (status === 'loading') {
    return (
      <div className='flex h-full min-h-screen w-full items-center justify-center'>
        Loading or not authenticated...
      </div>
    );
  }

  return (
    <div className='flex h-screen w-[full] flex-col items-center bg-[#FBFBFB]'>
      <Header session={session} />
      <main className='flex h-full w-full'>
        <div className='h-full bg-red-50 md:basis-1/2 xl:w-[720px]'></div>
        <div className='h-full w-full md:basis-1/2 xl:basis-auto'></div>
      </main>
    </div>
  );
};

export default Meetup;

export async function getServerSideProps(context: GetServerSideProps) {
  const { params }: any = context;
  const res = await getMeetupFromId(params.id as string);
  const data = await res;

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data },
  };
}
