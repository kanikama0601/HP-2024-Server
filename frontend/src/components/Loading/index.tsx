import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Footer } from "@/components/Footer";

interface LoadingProps {
  fullPage?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ fullPage = false }) => {
  const content = (
      <div className="glass-panel box-border flex h-40 w-56 flex-col items-center justify-center rounded-2xl text-center text-base leading-none shadow-xl transform-none scale-100">
        <p className="m-4 text-neutral-900">
          <FontAwesomeIcon icon={faSpinner} className="text-5xl fa-spin-pulse" />
        </p>
        <p className="m-4 text-neutral-600">Loading...</p>
      </div>
  );

  if (fullPage) {
    return (
      <main className="min-h-screen w-full flex flex-col">
        <div className="flex flex-1 items-center justify-center px-4">
          {content}
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </main>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center px-4 pointer-events-none isolate">
      {content}
    </div>
  );
};
