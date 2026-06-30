import authImage from "./assets/auth.png";

export default function InstagramApproval({ onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f2735] via-[#223a49] to-[#153f3b] text-white">
      <div className="max-w-md mx-auto px-8 pt-10">

        <button className="mb-8" onClick={onBack}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        <p className="text-sm text-gray-200 mb-4">
          • Instagram
        </p>

        <h1 className="text-3xl leading-tight font-bold tracking-tight">
          Check your notifications on another device
        </h1>

        <p className="mt-4 text-base leading-relaxed text-gray-300">
          Go to your Instagram account on another device and open the
          notification we sent to approve this login.
        </p>

        <div className="mt-6 rounded-2xl overflow-hidden bg-[#cbe8e7]">
          <img
            src={authImage}
            alt="Approval"
            className="w-full object-cover"
          />
        </div>

        <div className="flex mt-6 items-start gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="19" cy="12" r="1"/>
              <circle cx="5" cy="12" r="1"/>
            </svg>
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Waiting for approval
            </h2>

            <p className="text-gray-300 text-sm mt-1">
              Approve from the other device to continue.
            </p>
          </div>
        </div>

        <button onClick={onBack} className="mt-8 w-full h-12 rounded-full border border-gray-500 bg-transparent text-white text-base font-medium hover:bg-white/5 transition">
          Try another way
        </button>

      </div>
    </div>
  );
}
