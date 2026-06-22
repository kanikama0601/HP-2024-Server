import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Footer } from "@/components/Footer";

interface LoadingProps {
  fullPage?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-blue-100 bg-white px-10 py-8 shadow-lg shadow-blue-100/50">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-[3px] border-blue-100" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-[3px] border-blue-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm font-medium text-blue-700 tracking-widest">Loading...</p>
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
