/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-console */
import { DocumentData } from 'firebase/firestore';
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { BiUser } from 'react-icons/bi';
import { IoMdStar } from 'react-icons/io';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { getMeetupFromId } from '../../components/firebase/api/meetups';
import { useFirebaseAuthentication } from '../../components/firebase/presence';
import GoogleMaps from '../../components/GoogleMaps';
import Header from '../../components/Header';
import useBoundStore from '../../store';
import { ExtendedSession } from '../../types/session';

const Meetup: NextPage<{ data: DocumentData }> = ({ data }) => {
  const router = useRouter();
  const [places, setPlace] = useState([]);
  const nearbyPlaces = useBoundStore((state) => state.nearbyPlaces);
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
  const onlineStatus = useFirebaseAuthentication(status, session);

  useEffect(() => {
    console.log(data, 'online- ' + onlineStatus);
  }, [session, onlineStatus]);
  useEffect(() => {
    console.log(nearbyPlaces);
  }, [nearbyPlaces]);

  if (status === 'loading') {
    return (
      <div className='flex h-full min-h-screen w-full items-center justify-center'>
        Loading or not authenticated...
      </div>
    );
  }

  const RenderMembers = () => {
    return (
      <div className='flex rounded-xl border-2 p-2'>
        <span className='mr-2 ml-1'>
          {Object.keys(data.participants).length}
        </span>
        <BiUser size={20} />
      </div>
    );
  };

  type PlaceCardType = {
    name: string;
    [x: string]: any;
  };

  const PlaceCard = ({ name, ...rest }: PlaceCardType) => {
    const [photoUrls, setPhotoUrls] = useState([]);
    useEffect(() => {
      if (rest.photos?.length > 0) {
        console.log(rest.photos.length);
        rest.photos.map((photo: any, i: number) => {
          if ('getUrl' in photo)
            setPhotoUrls([
              ...photoUrls,
              photo.getUrl({ maxWidth: photo.width, maxHeight: photo.height }),
            ]);
        });
      }
    }, [rest.photos]);

    return (
      <div
        className='relative flex flex-col overflow-hidden rounded-xl'
        onMouseEnter={() => {
          console.log(rest.place_id);
          useBoundStore.setState({ activePlaceId: rest.place_id });
        }}
        onMouseLeave={() =>
          useBoundStore.setState({ activePlaceId: undefined })
        }
      >
        {photoUrls.length > 0 && (
          <div className='swiper-container relative aspect-square h-full w-full'>
            <Swiper
              observer={true}
              // ref={swiperRef}
              init={false}
              // navigation={{
              //   prevEl: ".prev",
              //   nextEl: ".next",
              // }}
              className='z-0 h-full w-full max-w-[22vw] text-left'
              spaceBetween={50}
              slidesPerView='auto'
              // onSwiper={(swiper) => console.log(swiper)}
              // onSlideChange={(i) => console.log("slide change", i)}
            >
              {photoUrls.map((photoUrl, i) => (
                <SwiperSlide key={i}>
                  <div className='relative aspect-square h-full w-full overflow-hidden rounded-xl'>
                    <Image
                      src={photoUrl}
                      layout='fill'
                      alt='image'
                      objectFit='cover'
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <div className='mt-2 flex items-center justify-between'>
          <span className='font-semibold line-clamp-1'>{name}</span>
          {rest.rating && (
            <div className='ml-2 flex items-center'>
              <div className='pb-1'>
                <IoMdStar size={18} />
              </div>
              <span className='ml-1'>{rest.rating}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className='flex h-screen w-[full] flex-col items-center bg-[#FBFBFB]'>
      <Header
        packed={true}
        session={session}
        right={
          <>
            <RenderMembers />
          </>
        }
      />
      <main className='mt-[92px] flex w-full'>
        <div className='relative h-full max-w-[740px] columns-2 gap-8 px-4 md:basis-1/2'>
          {nearbyPlaces.map((place, i) => (
            <div key={i} className='relative mb-6'>
              <PlaceCard {...place} />
            </div>
          ))}
        </div>
        <div className='sticky top-[92px] h-full max-h-[calc(100vh-92px)] w-full'>
          <GoogleMaps
            userCoordinates={{
              lat: parseFloat(
                data.participants[session?.user?.id as string].coordinates.lat
              ),
              lng: parseFloat(
                data.participants[session?.user?.id as string].coordinates.lng
              ),
            }}
            nearbySearchOptions={{
              radius: 50000,
              // type: ['restaurant'],
              openNow: false,
            }}
          />
        </div>
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
