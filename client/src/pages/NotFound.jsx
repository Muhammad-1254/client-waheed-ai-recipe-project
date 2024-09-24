import React from 'react';

const NotFound = () => {
  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center'>
      <h1 className='text-lg md:text-lg'><span className='font-semibold'>404</span> - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
