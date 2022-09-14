import React from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

export type InputProps = {
  /**
   * Input Label
   */
  label: string;
  /**
   *
   */
  value: string;
  /**
   * Function that runs when the input value changes
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (...event: any[]) => void;
  /**
   * Error message to show
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | null;
  /**
   * Remaining props
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [props: string]: any;
};

const Input = ({ label, value, onChange, error, ...rest }: InputProps) => {
  return (
    <div className='mb-1'>
      <label htmlFor='success' className='mb-2 block text-sm font-medium'>
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        type='text'
        id='success'
        className={`block w-full rounded-lg border p-4 text-sm focus:border-blue-500 focus:ring-blue-500 active:border-blue-500 ${
          error ? 'border border-red-500' : ''
        }`}
        {...rest}
      />
      {error && (
        <p className='mt-2 text-sm text-red-600'>
          <span>{error as string}</span>
        </p>
      )}
    </div>
  );
};

export default Input;
