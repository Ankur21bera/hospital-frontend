import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  HeartPulse,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";

import {
  submitEnquiry,
  applyJob,
  resetUserSuccessStates,
} from "../Redux/Slice/userSlice";

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  maxLength,
}) => {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full ${
            Icon ? "pl-11" : "px-4"
          } pr-4 py-3.5 rounded-xl border ${
            error
              ? "border-red-400 focus:ring-red-100"
              : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
          } bg-white outline-none focus:ring-4 transition text-sm text-slate-800 placeholder:text-slate-400`}
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1.5 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

const Contact = () => {
  const dispatch = useDispatch();
  const {
    enquiryLoading,
    jobLoading,
    enquiryError,
    jobError,
    enquirySuccess,
    jobApplicationSuccess,
  } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("enquiry");
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    question: "",
  });

  const [careerForm, setCareerForm] = useState({
    name: "",
    email: "",
    phone: "",
    jobType: "",
    resume: null,
  });

  const [enquiryErrors, setEnquiryErrors] = useState({});
  const [careerErrors, setCareerErrors] = useState({});

  useEffect(() => {
    if (enquirySuccess) {
      toast.success("Enquiry submitted successfully!");

      setEnquiryForm({
        name: "",
        email: "",
        phone: "",
        question: "",
      });

      setEnquiryErrors({});

      dispatch(resetUserSuccessStates());
    }
  }, [enquirySuccess, dispatch]);

  useEffect(() => {
    if (jobApplicationSuccess) {
      toast.success("Job application submitted successfully!");

      setCareerForm({
        name: "",
        email: "",
        phone: "",
        jobType: "",
        resume: null,
      });

      setCareerErrors({});

      dispatch(resetUserSuccessStates());
    }
  }, [jobApplicationSuccess, dispatch]);

  useEffect(() => {
    if (enquiryError) {
      toast.error(enquiryError);
      dispatch(resetUserSuccessStates());
    }
  }, [enquiryError, dispatch]);

  useEffect(() => {
    if (jobError) {
      toast.error(jobError);
      dispatch(resetUserSuccessStates());
    }
  }, [jobError, dispatch]);

  const validateEnquiry = () => {
    const errors = {};

    if (!enquiryForm.name.trim()) {
      errors.name = "Name is required";
    }

    if (!enquiryForm.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        enquiryForm.email
      )
    ) {
      errors.email = "Enter a valid email";
    }

    if (!enquiryForm.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (enquiryForm.phone.length !== 10) {
      errors.phone = "Enter a valid 10-digit phone number";
    }

    if (!enquiryForm.question.trim()) {
      errors.question = "Please enter your enquiry";
    }

    setEnquiryErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const validateCareer = () => {
    const errors = {};

    if (!careerForm.name.trim()) {
      errors.name = "Name is required";
    }

    if (!careerForm.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        careerForm.email
      )
    ) {
      errors.email = "Enter a valid email";
    }

    if (!careerForm.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (careerForm.phone.length !== 10) {
      errors.phone = "Enter a valid 10-digit phone number";
    }

    if (!careerForm.jobType) {
      errors.jobType = "Please select a job type";
    }

    if (!careerForm.resume) {
      errors.resume = "Please upload your resume";
    }

    setCareerErrors(errors);

    return Object.keys(errors).length === 0;
  };



  const handleEnquiryChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const phoneValue = value
        .replace(/\D/g, "")
        .slice(0, 10);

      setEnquiryForm((prev) => ({
        ...prev,
        phone: phoneValue,
      }));
    } else {
      setEnquiryForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setEnquiryErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };


  const handleCareerChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const phoneValue = value
        .replace(/\D/g, "")
        .slice(0, 10);

      setCareerForm((prev) => ({
        ...prev,
        phone: phoneValue,
      }));
    } else {
      setCareerForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setCareerErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0] || null;

    setCareerForm((prev) => ({
      ...prev,
      resume: file,
    }));

    setCareerErrors((prev) => ({
      ...prev,
      resume: "",
    }));
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();

    if (!validateEnquiry()) {
      return;
    }

    dispatch(submitEnquiry(enquiryForm));
  };

 

  const handleCareerSubmit = (e) => {
    e.preventDefault();

    if (!validateCareer()) {
      return;
    }

    const formData = new FormData();

    formData.append("name", careerForm.name);
    formData.append("email", careerForm.email);
    formData.append("phone", careerForm.phone);
    formData.append("jobType", careerForm.jobType);
    formData.append("resume", careerForm.resume);

    dispatch(applyJob(formData));
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700">

        <div className="absolute inset-0 bg-black/10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold backdrop-blur-md">
              <HeartPulse size={17} />
              We are here to help
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mt-6 leading-tight">
              Contact Us
            </h1>

            <p className="text-indigo-100 text-base sm:text-lg leading-7 mt-5 max-w-2xl">
              Have a question, need assistance, or want to
              join our team? Send us a message and our team
              will get back to you.
            </p>

          </div>

        </div>

      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1 space-y-6">

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">

              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <MessageCircle
                  size={24}
                  className="text-indigo-600"
                />
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 mt-5">
                Get in Touch
              </h2>

              <p className="text-slate-500 leading-6 mt-2">
                Our support team is ready to help you with
                your questions and requirements.
              </p>

              <div className="space-y-5 mt-7">

                <div className="flex items-start gap-4">

                  <div className="w-10 h-10 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Mail
                      size={18}
                      className="text-indigo-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide font-bold text-slate-400">
                      Email
                    </p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      support@example.com
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-4">

                  <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Phone
                      size={18}
                      className="text-emerald-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide font-bold text-slate-400">
                      Phone
                    </p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      +91 98765 43210
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-4">

                  <div className="w-10 h-10 shrink-0 rounded-xl bg-orange-50 flex items-center justify-center">
                    <MapPin
                      size={18}
                      className="text-orange-600"
                    />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide font-bold text-slate-400">
                      Location
                    </p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      New Delhi, India
                    </p>
                  </div>

                </div>

              </div>

            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-7 text-white">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                  <ShieldCheck size={23} />
                </div>

                <div>
                  <h3 className="font-extrabold">
                    Your Privacy Matters
                  </h3>

                  <p className="text-sm text-slate-300 mt-1">
                    Your information is kept secure.
                  </p>
                </div>

              </div>

              <p className="text-sm text-slate-300 leading-6 mt-5">
                We only use the information you provide to
                respond to your enquiry or process your job
                application.
              </p>

            </div>

          </div>

          <div className="lg:col-span-2">

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

              {/* Tabs */}

              <div className="grid grid-cols-2 border-b border-slate-200">

                <button
                  type="button"
                  onClick={() => setActiveTab("enquiry")}
                  className={`py-5 px-4 font-bold text-sm sm:text-base transition cursor-pointer ${
                    activeTab === "enquiry"
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/40"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <MessageCircle size={18} />
                    General Enquiry
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("career")}
                  className={`py-5 px-4 font-bold text-sm sm:text-base transition cursor-pointer ${
                    activeTab === "career"
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/40"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <BriefcaseBusiness size={18} />
                    Careers
                  </span>
                </button>

              </div>
              {activeTab === "enquiry" && (

                <form
                  onSubmit={handleEnquirySubmit}
                  className="p-6 sm:p-8"
                >

                  <div className="mb-7">

                    <p className="text-xs uppercase tracking-wide text-indigo-600 font-bold">
                      Send Us a Message
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      How Can We Help?
                    </h2>

                    <p className="text-slate-500 text-sm mt-2">
                      Fill in the details below and we will
                      get back to you.
                    </p>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <FormInput
                      label="Full Name"
                      name="name"
                      value={enquiryForm.name}
                      onChange={handleEnquiryChange}
                      placeholder="Enter your name"
                      icon={User}
                      error={enquiryErrors.name}
                    />

                    <FormInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={enquiryForm.email}
                      onChange={handleEnquiryChange}
                      placeholder="Enter your email"
                      icon={Mail}
                      error={enquiryErrors.email}
                    />

                    <FormInput
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={enquiryForm.phone}
                      onChange={handleEnquiryChange}
                      placeholder="10-digit phone number"
                      icon={Phone}
                      maxLength={10}
                      error={enquiryErrors.phone}
                    />

                  </div>

                  <div className="mt-5">

                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Your Enquiry
                    </label>

                    <textarea
                      name="question"
                      value={enquiryForm.question}
                      onChange={handleEnquiryChange}
                      placeholder="Write your question or message..."
                      rows={6}
                      className={`w-full px-4 py-3.5 rounded-xl border ${
                        enquiryErrors.question
                          ? "border-red-400 focus:ring-red-100"
                          : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                      } bg-white outline-none focus:ring-4 transition text-sm text-slate-800 placeholder:text-slate-400 resize-none`}
                    />

                    {enquiryErrors.question && (
                      <p className="text-xs text-red-500 mt-1.5 font-medium">
                        {enquiryErrors.question}
                      </p>
                    )}

                  </div>

                  <button
                    type="submit"
                    disabled={enquiryLoading}
                    className={`w-full sm:w-auto mt-6 px-7 py-3.5 rounded-xl text-white font-bold inline-flex items-center justify-center gap-2 transition ${
                      enquiryLoading
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer shadow-lg shadow-indigo-200"
                    }`}
                  >
                    {enquiryLoading ? (
                      <>
                        <Clock3
                          size={18}
                          className="animate-spin"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Enquiry
                        <Send size={18} />
                      </>
                    )}
                  </button>

                </form>
              )}

              {activeTab === "career" && (

                <form
                  onSubmit={handleCareerSubmit}
                  className="p-6 sm:p-8"
                >

                  <div className="mb-7">

                    <p className="text-xs uppercase tracking-wide text-indigo-600 font-bold">
                      Join Our Team
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      Build Your Career With Us
                    </h2>

                    <p className="text-slate-500 text-sm mt-2">
                      Submit your details and resume for
                      available opportunities.
                    </p>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <FormInput
                      label="Full Name"
                      name="name"
                      value={careerForm.name}
                      onChange={handleCareerChange}
                      placeholder="Enter your name"
                      icon={User}
                      error={careerErrors.name}
                    />

                    <FormInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={careerForm.email}
                      onChange={handleCareerChange}
                      placeholder="Enter your email"
                      icon={Mail}
                      error={careerErrors.email}
                    />

                    <FormInput
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={careerForm.phone}
                      onChange={handleCareerChange}
                      placeholder="10-digit phone number"
                      icon={Phone}
                      maxLength={10}
                      error={careerErrors.phone}
                    />

                    <div>

                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Job Type
                      </label>

                      <div className="relative">

                        <BriefcaseBusiness
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />

                        <select
                          name="jobType"
                          value={careerForm.jobType}
                          onChange={handleCareerChange}
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${
                            careerErrors.jobType
                              ? "border-red-400"
                              : "border-slate-200 focus:border-indigo-500"
                          } bg-white outline-none focus:ring-4 focus:ring-indigo-100 transition text-sm text-slate-800 cursor-pointer`}
                        >
                          <option value="">
                            Select job type
                          </option>
                          <option value="Frontend Developer">
                            Frontend Developer
                          </option>
                          <option value="Backend Developer">
                            Backend Developer
                          </option>
                          <option value="Full Stack Developer">
                            Full Stack Developer
                          </option>
                          <option value="Other">
                            Other
                          </option>
                        </select>

                      </div>

                      {careerErrors.jobType && (
                        <p className="text-xs text-red-500 mt-1.5 font-medium">
                          {careerErrors.jobType}
                        </p>
                      )}

                    </div>

                  </div>

                  {/* Resume */}

                  <div className="mt-5">

                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Resume
                    </label>

                    <label className={`block border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                      careerErrors.resume
                        ? "border-red-400 bg-red-50"
                        : "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30"
                    }`}>

                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={handleResumeChange}
                      />

                      <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-50 flex items-center justify-center">
                        <Upload
                          size={22}
                          className="text-indigo-600"
                        />
                      </div>

                      {careerForm.resume ? (

                        <div className="mt-3">

                          <p className="font-bold text-slate-800 text-sm break-all">
                            {careerForm.resume.name}
                          </p>

                          <p className="text-xs text-green-600 mt-1 font-semibold">
                            Resume selected successfully
                          </p>

                        </div>

                      ) : (

                        <div className="mt-3">

                          <p className="font-bold text-slate-800">
                            Upload your resume
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            PDF format recommended
                          </p>

                        </div>

                      )}

                    </label>

                    {careerErrors.resume && (
                      <p className="text-xs text-red-500 mt-1.5 font-medium">
                        {careerErrors.resume}
                      </p>
                    )}

                  </div>

                  <button
                    type="submit"
                    disabled={jobLoading}
                    className={`w-full sm:w-auto mt-6 px-7 py-3.5 rounded-xl text-white cursor-pointer font-bold inline-flex items-center justify-center gap-2 transition ${
                      jobLoading
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer shadow-lg shadow-indigo-200"
                    }`}
                  >
                    {jobLoading ? (
                      <>
                        <Clock3
                          size={18}
                          className="animate-spin"
                        />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          BOTTOM INFO
      ================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Users
                size={21}
                className="text-indigo-600"
              />
            </div>

            <div>
              <p className="font-extrabold text-slate-900">
                Friendly Support
              </p>

              <p className="text-xs text-slate-500 mt-1">
                We are happy to assist
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2
                size={21}
                className="text-emerald-600"
              />
            </div>

            <div>
              <p className="font-extrabold text-slate-900">
                Quick Response
              </p>

              <p className="text-xs text-slate-500 mt-1">
                We respond as soon as possible
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
              <FileText
                size={21}
                className="text-orange-600"
              />
            </div>

            <div>
              <p className="font-extrabold text-slate-900">
                Easy Application
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Simple and secure process
              </p>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
};
export default Contact;
