import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export const Loading = () => {
  return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800-opacity">
            <div className="w-fit m-auto px-4 py-4 rounded-lg inline-block text-center bg-white">
              <p className="text-sm m-4"><FontAwesomeIcon icon={faSpinner} className='text-5xl fa-spin-pulse' /></p>
              <p className="text-sm m-4">Loading...</p>
            </div>
        </div>
      );
};
