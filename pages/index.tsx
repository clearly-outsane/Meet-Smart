import type { NextPage } from 'next';
import React, { useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import Head from 'next/head';
import Image from 'next/image';

const Home: NextPage = () => {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  return (
    <div className='w-[full] h-screen'>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.NEXT_PUBLIC_GMAPS_API_KEY as string,
        }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      ></GoogleMapReact>
    </div>
  );
};

export default Home;
