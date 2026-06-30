import {
  ArrowLeft,
  MoreHorizontal,
} from "lucide-react";
import authImage from "../assets/auth.png";

export default function InstagramApproval({ onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f2735] via-[#223a49] to-[#153f3b] text-white">
      <div className="max-w-md mx-auto px-8 pt-14">

        <button className="mb-8" onClick={onBack}>
          <ArrowLeft size={28} className="text-white" />
        </button>

        <p className="text-[18px] text-gray-200 mb-4">
          • Instagram
        </p>

        <h1 className="text-[48px] leading-[52px] font-bold tracking-tight">
          Check your notifications on another device
        </h1>

        <p className="mt-6 text-[26px] leading-[36px] text-gray-300">
          Go to your Instagram account on another device and open the
          notification we sent to approve this login.
        </p>

        <div className="mt-10 rounded-3xl overflow-hidden bg-[#cbe8e7]">
          <img
            src={authImage}
            alt="Approval"
            className="w-full object-cover"
          />
        </div>

        <div className="flex mt-8 items-start gap-5">
          <div className="w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center">
            <MoreHorizontal size={24} />
          </div>

          <div>
            <h2 className="text-[32px] font-semibold">
              Waiting for approval
            </h2>

            <p className="text-gray-300 text-[22px] mt-1">
              Approve from the other device to continue.
            </p>
          </div>
        </div>

        <button onClick={onBack} className="mt-10 w-full h-16 rounded-full border border-gray-500 bg-transparent text-white text-2xl font-medium hover:bg-white/5 transition">
          Try another way
        </button>

      </div>
    </div>
  );
}
