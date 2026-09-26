import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#fbfbfd] text-neutral-900 flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Subtle Icon Badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200/80 text-neutral-600 shadow-xs mb-2">
          <Compass className="w-8 h-8 text-neutral-500 stroke-[1.5]" />
        </div>

        {/* Status & Title */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">404 Error</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
            Page Not Found
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed max-w-sm mx-auto">
            The page you are looking for doesn&apos;t exist, has been moved, or is temporarily disabled.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-white bg-neutral-900 hover:bg-black transition-all shadow-xs hover:shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
