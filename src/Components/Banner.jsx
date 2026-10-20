
import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  ShieldCheck,
  HeartPulse,
} from "lucide-react";

const Banner = () => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate("/login");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="my-16 px-4 sm:my-20 sm:px-6 lg:mx-4 lg:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#5969F7] via-[#4D5EEB] to-[#3949D6] shadow-[0_20px_60px_rgba(69,86,230,0.20)] lg:rounded-[36px]">

        {/* Background Decoration */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />

        <div className="relative grid grid-cols-1 items-center md:grid-cols-[1.1fr_0.9fr]">

          {/* Left Content */}
          <div className="relative z-10 flex flex-col items-start px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16 xl:px-16">

            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white sm:text-sm">
              <HeartPulse size={16} className="text-cyan-200" />
              YOUR HEALTH, OUR PRIORITY
            </div>

            {/* Heading */}
            <h2 className="max-w-xl text-[32px] font-bold leading-[1.18] tracking-tight text-white sm:text-4xl lg:text-[46px] xl:text-[52px]">
              Book Your Appointment
              <span className="mt-2 block text-cyan-200">
                With Trusted Doctors
              </span>
            </h2>

            {/* Description */}
            <p className="mt-5 max-w-lg text-sm leading-7 text-blue-100 sm:text-base sm:leading-8">
              Take control of your health with easy online appointments.
              Connect with experienced doctors and get the care you deserve.
            </p>

            {/* Trust Information */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex items-center gap-2 text-sm text-white">
                <ShieldCheck size={18} className="shrink-0 text-cyan-200" />
                <span>Trusted Professionals</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-white">
                <CalendarCheck size={18} className="shrink-0 text-cyan-200" />
                <span>Easy Online Booking</span>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handleCreateAccount}
              className="group mt-8 inline-flex cursor-pointer min-h-[52px] items-center justify-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#4658E7] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-50 hover:shadow-xl sm:px-8"
            >
              Create Account
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <p className="mt-4 text-xs text-blue-100/90">
              Simple booking. Personalized care.
            </p>
          </div>

          {/* Right Image Area */}
          <div className="relative flex min-h-[280px] items-end justify-center px-5 pt-2 sm:min-h-[360px] md:h-full md:min-h-[440px] md:justify-center md:px-4 md:pt-0 lg:min-h-[500px]">

            {/* Image Background */}
            <div className="pointer-events-none absolute bottom-0 left-1/2 h-[230px] w-[230px] -translate-x-1/2 rounded-full bg-white/10 sm:h-[290px] sm:w-[290px] md:bottom-8 md:h-[310px] md:w-[310px] lg:bottom-10 lg:h-[370px] lg:w-[370px]" />

            <div className="pointer-events-none absolute bottom-0 left-1/2 h-[200px] w-[200px] -translate-x-1/2 rounded-full border border-white/15 sm:h-[255px] sm:w-[255px] md:bottom-8 md:h-[275px] md:w-[275px] lg:bottom-10 lg:h-[330px] lg:w-[330px]" />

            {/* Doctor Image */}
            <img
              src={assets.appointment_img}
              alt="Doctor for your appointment"
              className="relative z-10 block h-auto w-full max-w-[300px] object-contain object-bottom sm:max-w-[360px] md:absolute md:bottom-0 md:left-1/2 md:w-[110%] md:max-w-[440px] md:-translate-x-1/2 lg:max-w-[500px] xl:max-w-[540px]"
            />

            {/* Floating Info Card */}
            <div className="absolute bottom-5 left-4 z-20 hidden items-center gap-3 rounded-2xl border border-white/70 bg-white px-4 py-3 shadow-[0_12px_35px_rgba(15,23,42,0.14)] sm:flex md:bottom-8 md:left-0 lg:bottom-10 lg:left-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={21} />
              </div>

              <div>
                <p className="whitespace-nowrap text-sm font-bold text-slate-800">
                  Care You Can Trust
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Your health comes first
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;