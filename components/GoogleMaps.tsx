/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { isLatLngLiteral } from '@googlemaps/typescript-guards';
import { createCustomEqual } from 'fast-equals';
import * as React from 'react';

import { styleArray } from '../constants/maps';
import useBoundStore from '../store';

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

type MapComponentProps = {
  userCoordinates?: google.maps.LatLngLiteral;
  nearbySearchOptions?: { [x: string]: any };
};

const defaultCoordinates = {
  lat: 37.0902,
  lng: -95.7129,
};

const App: React.FC<MapComponentProps> = ({
  userCoordinates,
  nearbySearchOptions,
}) => {
  const [zoom, setZoom] = React.useState(15); // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>(
    userCoordinates ? userCoordinates : defaultCoordinates
  );

  const onIdle = (m: google.maps.Map) => {
    setZoom(m.getZoom()!);
    setCenter(m.getCenter().toJSON());
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Wrapper
        // apiKey={process.env.NEXT_PUBLIC_GMAPS_API_KEY as string}
        render={render}
      >
        <Map
          center={center}
          onIdle={onIdle}
          zoom={zoom}
          style={{ flexGrow: '1', height: '100%' }}
          nearbySearchOptions={
            nearbySearchOptions
              ? { location: userCoordinates, ...nearbySearchOptions }
              : null
          }
        >
          {/* {clicks.map((latLng, i) => (
            <Marker key={i} position={latLng} />
          ))} */}
          {userCoordinates && (
            <Marker
              position={userCoordinates}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillOpacity: 1,
                strokeWeight: 4,
                fillColor: '#5384ED',
                strokeColor: '#ffffff',
              }}
            />
          )}
        </Map>
      </Wrapper>
    </div>
  );
};
interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
  [option: string]: any;
}

const Map: React.FC<MapProps> = ({
  onClick,
  onIdle,
  children,
  style,
  nearbySearchOptions,
  ...options
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [map, setMap] = React.useState<google.maps.Map>();
  const [addNearbyPlacesToStore, nearbyPlaces] = useBoundStore((state) => [
    state.addNearbyPlaces,
    state.nearbyPlaces,
  ]);
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('re render');
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          styles: styleArray,
          mapId: 'DEMO_MAP_ID',
        })
      );
    }
  }, [ref, map]);

  function addPlaces(places: google.maps.places.PlaceResult[]) {
    addNearbyPlacesToStore(places);
  }

  React.useEffect(() => {
    if (map && nearbySearchOptions) {
      const service = new google.maps.places.PlacesService(map);
      useBoundStore.setState({ nearbyPlaces: [] });
      service.nearbySearch(
        {
          location: defaultCoordinates,
          radius: 500,
          ...nearbySearchOptions,
        },
        (
          results: google.maps.places.PlaceResult[] | null,
          status: google.maps.places.PlacesServiceStatus,
          pagination: google.maps.places.PlaceSearchPagination | null
        ) => {
          if (status !== 'OK' || !results) return;

          addPlaces(results);
          // TODO: Add pagination to a button or make it a callable function
          if (
            pagination &&
            pagination.hasNextPage &&
            nearbyPlaces.length < 20
          ) {
            //   // Note: nextPage will call the same handler function as the initial call
            pagination.nextPage();
          }
        }
      );
    }
  }, [ref, map]);

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  React.useEffect(() => {
    if (map) {
      ['click', 'idle'].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener('click', onClick);
      }

      if (onIdle) {
        map.addListener('idle', () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
        }
      })}
      {nearbyPlaces.length > 0 &&
        google.maps.marker &&
        nearbyPlaces.map((place, i) => {
          return (
            <AdvancedMarker
              key={i}
              title={place.name!}
              position={place.geometry.location}
              labelContent={place.rating}
              map={map}
              place_id={place.place_id}
            />
          );
        })}
    </>
  );
};

const AdvancedMarker: React.FC<
  google.maps.marker.AdvancedMarkerViewOptions
> = ({ labelContent, place_id, ...options }) => {
  const [marker, setMarker] =
    React.useState<google.maps.marker.AdvancedMarkerView>();
  const ref = React.useRef(null);
  const activePlaceId = useBoundStore((state) => state.activePlaceId);

  React.useEffect(() => {
    if (!marker && options.map) {
      const markerView = new google.maps.marker.AdvancedMarkerView({
        content: ref.current,
        ...options,
      });
      setMarker(markerView);
    }
  }, [marker, options, ref]);

  return (
    <div
      ref={ref}
      className={`relative rounded-[8px] bg-white px-[15px] py-[10px] text-[14px] drop-shadow-md after:absolute after:left-[50%] after:top-[100%] after:h-0 after:w-0 after:translate-x-[-50%] after:translate-y-[0] after:border-r-[8px] after:border-l-[8px] after:border-t-[8px] after:border-t-white after:border-r-[transparent] after:content-[""] ${
        activePlaceId !== undefined && activePlaceId === place_id
          ? 'bg-black text-white after:border-t-black'
          : ''
      }`}
    >
      {labelContent ?? 'NA'}
    </div>
  );
};

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
  const [marker, setMarker] = React.useState<google.maps.Marker>();

  React.useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};

const deepCompareEqualsForMaps = createCustomEqual(
  (deepEqual) => (a: any, b: any) => {
    if (
      isLatLngLiteral(a) ||
      a instanceof google.maps.LatLng ||
      isLatLngLiteral(b) ||
      b instanceof google.maps.LatLng
    ) {
      return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
    }

    // TODO extend to other types

    // use fast-equals for other objects
    return deepEqual(a, b);
  }
);

function useDeepCompareMemoize(value: any) {
  const ref = React.useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffectForMaps(
  callback: React.EffectCallback,
  dependencies: any[]
) {
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

export default App;
