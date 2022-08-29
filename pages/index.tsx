import GoogleMapReact from 'google-map-react';
import type { NextPage } from 'next';
import React from 'react';

const Home: NextPage = () => {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  return (
    <div className='h-screen w-[full]'>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.NEXT_PUBLIC_GMAPS_API_KEY as string,
        }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <div>Some text</div>
      </GoogleMapReact>
    </div>
  );
};

export default Home;
