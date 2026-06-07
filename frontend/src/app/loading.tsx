import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Footer } from "@/components/Footer";

export default function AppLoading() {
  return (
    <main className="min-h-screen w-full flex flex-col">
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="glass-panel rounded-2xl px-6 py-6 text-center">
          <p className="text-sm m-4 text-neutral-900">
            <FontAwesomeIcon icon={faSpinner} className="text-5xl fa-spin-pulse" />
          </p>
          <p className="text-sm m-4 text-neutral-600">Loading...</p>
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </main>
  );
}
