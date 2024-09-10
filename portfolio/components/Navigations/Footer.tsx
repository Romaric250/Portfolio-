import React from 'react';

const Footer = () => {
  return (
    <div className="bg-primary text-white h-16 sm:h-20 md:h-24 lg:h-28 fixed bottom-0 left-0 w-full">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center py-4 px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="text-lg sm:text-xl md:text-2xl font-bold cursor-pointer">
          R.L
        </div>
        <div className="text-lg sm:text-xl md:text-2xl font-bold cursor-pointer">
          2021
        </div>
      </div>
    </div>
  );
};

export default Footer;