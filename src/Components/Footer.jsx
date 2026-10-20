import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";

import {
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaFacebookF,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  const patientLinks = [
    { name: "Find Doctors", path: "/doctors" },
    { name: "My Profile", path: "/my-profile" },
    { name: "My Appointments", path: "/my-appointments" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: FaInstagram,
      url: "https://www.instagram.com/",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedinIn,
      url: "https://www.linkedin.com/",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      url: "https://twitter.com/",
    },
    {
      name: "Facebook",
      icon: FaFacebookF,
      url: "https://www.facebook.com/",
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-gray-200 bg-white">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-50/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-cyan-50/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 pb-6 pt-14 sm:px-8 lg:px-10 lg:pt-20">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1fr_1.1fr] lg:gap-12">
          {/* Brand Section */}
          <div>
            <Link to="/" className="inline-flex items-center">
              <img
                src={assets.logo}
                alt="Prescripto Logo"
                className="h-10 w-auto object-contain sm:h-12"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-500 sm:text-[15px]">
              Your health deserves the best care. Discover trusted doctors,
              book appointments effortlessly, and manage your healthcare
              journey with Prescripto.
            </p>

            {/* Trust Badge */}
            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Healthcare You Can Trust
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  Your care, our priority
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-base font-bold text-gray-900 sm:text-lg">
              Company
            </h3>

            <div className="mt-5 h-1 w-10 rounded-full bg-blue-600" />

            <ul className="mt-5 space-y-4">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group inline-flex items-center gap-2 text-sm text-gray-500 transition-colors duration-200 hover:text-blue-600 sm:text-[15px]"
                  >
                    <span>{link.name}</span>

                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Patient Links */}
          <div>
            <h3 className="text-base font-bold text-gray-900 sm:text-lg">
              For Patients
            </h3>

            <div className="mt-5 h-1 w-10 rounded-full bg-blue-600" />

            <ul className="mt-5 space-y-4">
              {patientLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group inline-flex items-center gap-2 text-sm text-gray-500 transition-colors duration-200 hover:text-blue-600 sm:text-[15px]"
                  >
                    <span>{link.name}</span>

                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-base font-bold text-gray-900 sm:text-lg">
              Get in Touch
            </h3>

            <div className="mt-5 h-1 w-10 rounded-full bg-blue-600" />

            <div className="mt-5 space-y-5">
              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MapPin size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Our Location
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Delhi NCR, India
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Phone size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Call Us
                  </p>

                  <a
                    href="tel:+911234567890"
                    className="mt-1 block text-sm text-gray-500 transition-colors hover:text-blue-600"
                  >
                    +91 12345 67890
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Mail size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Email Us
                  </p>

                  <a
                    href="mailto:support@prescripto.com"
                    className="mt-1 block break-all text-sm text-gray-500 transition-colors hover:text-blue-600"
                  >
                    support@prescripto.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 border-t border-gray-200 pt-6 sm:mt-16">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-xs leading-6 text-gray-500 sm:text-sm">
              © {currentYear} Prescripto. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500 sm:gap-3 sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                Made with
                <HeartPulse
                  size={15}
                  className="fill-red-500 text-red-500"
                />
                for better healthcare
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
