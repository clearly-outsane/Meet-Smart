import useOnclickOutside from 'react-cool-onclickoutside';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

import Input, { InputProps } from './Input';

type AutocompleteProps = InputProps & {
  getCoordinates: (coordinates: { lat: number; lng: number }) => void;
};

const PlacesAutocomplete = ({
  label,
  value,
  onChange,
  error,
  getCoordinates,
  ...rest
}: AutocompleteProps) => {
  const {
    ready,
    // value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });
  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e: any) => {
    // Update the keyword of the input element
    onChange(e.target.value);
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }: { [x: string]: any }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      onChange(description);
      clearSuggestions();

      // Get latitude and longitude via utility functions
      getGeocode({ address: description }).then((results) => {
        const { lat, lng } = getLatLng(results[0]);
        getCoordinates({ lat, lng });
        // console.log('📍 Coordinates: ', { lat, lng });
      });
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          className='cursor-pointer py-2 px-2 hover:bg-gray-200'
          key={place_id}
          onClick={handleSelect(suggestion)}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div ref={ref}>
      <Input
        label={label}
        value={value}
        onChange={handleInput}
        error={error}
        disabled={!ready}
        {...rest}
      />

      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === 'OK' && <ul>{renderSuggestions()}</ul>}
    </div>
  );
};

export default PlacesAutocomplete;
