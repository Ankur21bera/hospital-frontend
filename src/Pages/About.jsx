
import React from "react";
import { assets } from "../assets/assets";
import {
  HeartPulse,
  ShieldCheck,
  CalendarCheck,
  Users,
  ArrowUpRight,
  CheckCircle2,
  Stethoscope,
  Clock3,
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: CalendarCheck,
      number: "01",
      title: "Easy Appointment Booking",
      description:
        "Book appointments with trusted doctors in just a few clicks. Healthcare that fits your schedule.",
    },
    {
      icon: ShieldCheck,
      number: "02",
      title: "Trusted Healthcare",
      description:
        "Discover healthcare professionals and make informed decisions about your medical care.",
    },
    {
      icon: HeartPulse,
      number: "03",
      title: "Patient-First Care",
      description:
        "Enjoy a convenient experience designed around your healthcare needs and peace of mind.",
    },
  ];

  const highlights = [
    "Simple and convenient appointment management",
    "Access to healthcare professionals",
    "A user-friendly experience on every device",
  ];

  return (
    <main className="overflow-hidden bg-white text-gray-800">
      {/* Hero / Page Heading */}
      <section className="relative px-4 pb-8 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="relative mx-auto max-w-7xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 sm:text-sm">
            <HeartPulse size={16} />
            About Prescripto
          </span>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Healthcare made{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              simpler for you.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            We believe accessing quality healthcare should be simple,
            convenient, and centered around you. Discover a better way to
            manage your healthcare journey with Prescripto.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-tl-[2rem] border-l-2 border-t-2 border-blue-200 sm:-left-6 sm:-top-6" />

            <div className="relative overflow-hidden rounded-2xl bg-blue-50 shadow-xl shadow-blue-900/10 sm:rounded-3xl">
              <img
                className="h-[300px] w-full object-cover object-center transition-transform duration-700 hover:scale-105 sm:h-[400px] lg:h-[450px]"
                src={assets.about_image}
                alt="Healthcare professionals providing patient care"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/40 bg-white/95 p-4 shadow-lg backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Stethoscope size={23} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Your Health, Our Priority
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                      A more convenient healthcare experience.
                    </p>
                  </div>
                  <CheckCircle2
                    size={22}
                    className="ml-auto shrink-0 text-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-3 -z-0 h-24 w-24 rounded-br-[2rem] border-b-2 border-r-2 border-cyan-200 sm:-bottom-6 sm:-right-6" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
              Who We Are
            </span>

            <h2 className="mt-3 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Making healthcare accessible, one appointment at a time.
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-gray-600 sm:text-base">
              <p>
                Welcome to <strong className="font-semibold text-gray-800">Prescripto</strong>,
                your trusted partner for managing healthcare needs conveniently
                and efficiently. We understand that finding the right doctor
                and scheduling appointments can sometimes feel complicated.
              </p>

              <p>
                Our platform is designed to make that journey easier by helping
                you explore doctors, manage appointments, and stay organized
                throughout your healthcare experience.
              </p>
            </div>

            {/* Vision Card */}
            <div className="mt-7 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <HeartPulse size={23} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Our Vision
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    To create a seamless healthcare experience that connects
                    patients with healthcare providers and helps make access
                    to care more convenient.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="mt-6 space-y-3">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-emerald-500"
                  />
                  <p className="text-sm leading-6 text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 shadow-sm sm:text-sm">
              Why Choose Us
            </span>

            <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              A better experience,{" "}
              <span className="text-blue-600">built around you.</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
              We focus on making every step of your healthcare journey more
              organized, convenient, and user-friendly.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 md:grid-cols-3 md:gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.number}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/10 sm:p-8"
                >
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-50 transition-transform duration-500 group-hover:scale-150" />

                  <div className="relative flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                      <Icon size={27} strokeWidth={1.8} />
                    </div>

                    <span className="text-sm font-bold tracking-widest text-gray-300 transition-colors group-hover:text-blue-300">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="relative mt-7 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-700 sm:text-xl">
                    {feature.title}
                  </h3>

                  <p className="relative mt-3 text-sm leading-7 text-gray-500">
                    {feature.description}
                  </p>

                  <div className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-blue-600">
                    Patient-focused care
                    <ArrowUpRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing Banner */}
      <section className="px-4 pb-14 pt-4 sm:px-6 sm:pb-20 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 px-6 py-10 shadow-xl shadow-blue-900/15 sm:px-10 sm:py-14 lg:px-14">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
          <div className="absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-cyan-300/20 blur-2xl" />

          <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-100">
                <Clock3 size={17} />
                Healthcare, made convenient
              </div>

              <h2 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                Your journey to better healthcare starts here.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
                Explore your options, find a doctor, and take the next step
                toward managing your healthcare with confidence.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-5 py-4 text-white backdrop-blur-sm">
              <Users size={24} />
              <div>
                <p className="font-semibold">Patient First</p>
                <p className="mt-1 text-xs text-blue-100">
                  Care that puts you first
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
