import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center px-4 pointer-events-none isolate">
      <div className="glass-panel box-border flex h-40 w-56 flex-col items-center justify-center rounded-2xl text-center text-base leading-none shadow-xl transform-none scale-100">
        <p className="m-4 text-neutral-900">
          <FontAwesomeIcon icon={faSpinner} className="text-5xl fa-spin-pulse" />
        </p>
        <p className="m-4 text-neutral-600">Loading...</p>
      </div>
    </div>
      );
};
