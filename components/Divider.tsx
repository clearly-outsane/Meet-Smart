import React from 'react';

type DividerProps = {
  content: string;
};

const Divider = ({ content }: DividerProps) => {
  return (
    <div className='relative flex w-full items-center py-5'>
      <div className='flex-grow border-t border-gray-400'></div>
      <span className='mx-4 flex-shrink text-gray-400'>{content}</span>
      <div className='flex-grow border-t border-gray-400'></div>
    </div>
  );
};

export default Divider;
