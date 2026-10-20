import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserError,
  clearUserMessage,
  getProfile,
  updateProfile,
} from "../Redux/Slice/userSlice";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  Edit3,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  ShieldCheckIcon,
  Sparkles,
  User,
  VenusAndMars,
  X,
} from "lucide-react";

// --info-card--
const InfoCard = ({ icon, label, value, locked = false }) => {
  return (
    <div className="group rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5 hover:bg-white hover:border-blue-100 hover:shadow-sm transition">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-50 transition">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-slate-400 truncate">
              {label}
            </p>
            {locked && (
              <LockKeyhole size={12} className="text-slate-400 shrink-0" />
            )}
          </div>
          <p className="text-sm sm:text-base font-bold text-slate-800 mt-1 break-words">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

// --form-field--

const FormField = ({
  label,
  name,
  value,
  onChange,
  icon,
  placeholder,
  type = "text",
  select = false,
  children,
}) => {
  return (
    <div className="min-w-0">
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
          {icon}
        </span>
        {select ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 cursor-pointer appearance-none"
          >
            {children}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 cursor-pointer appearance-none"
          />
        )}
      </div>
    </div>
  );
};

const Myprofile = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { user, profileLoading, profileError, message } = useSelector(
    (state) => state.user,
  );
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    gender: "",
    dob: "",
  });

  // --fetch-profile--
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  // -success-message--

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearUserMessage());
    }
    if (profileError) {
      toast.error(profileError);
      dispatch(clearUserError());
    }
  }, [message, profileError, dispatch]);

  // --set-form-data--

  useEffect(()=>{
    window.scrollTo(0,0);
  },[])

  useEffect(() => {
    if (!user) return;
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      addressLine1: user.address?.line1 || "",
      addressLine2: user.address?.line2 || "",
      gender: user.gender || "",
      dob: user.dob ? user.dob.substring(0, 10) : "",
    });
    setImagePreview(user.image || "");
  }, [user]);

  // --open-modal--
  const handleOpenModal = () => {
    if (!user) return;
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      addressLine1: user.address?.line1 || "",
      addressLine2: user.address?.line2 || "",
      gender: user.gender || "",
      dob: user.dob ? user.dob.substring(0, 10) : "",
    });
    setSelectedImage(null);
    setImagePreview(user.image || "");
    setOpenModal(true);
  };

  // --close-modal--
  const handleCloseModal = () => {
    if (profileLoading) return;
    setOpenModal(false);
    setSelectedImage(null);
    if (user?.image) {
      setImagePreview(user.image);
    }
  };

  // --input-change--

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  // --image-change--
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please Select A Valid Image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image Size Must Be Less Than 5 Mb");
      return;
    }
    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // --update-profile--
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please Enter Your Name");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please Enter Phone Number");
      return;
    }
    if (!formData.gender) {
      toast.error("Please Enter Gender");
      return;
    }
    if (!formData.dob) {
      toast.error("Please Select Your Date Of Birth");
      return;
    }
    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("phone", formData.phone.trim());
    data.append("gender", formData.gender);
    data.append("dob", formData.dob);
    data.append(
      "address",
      JSON.stringify({
        line1: formData.addressLine1.trim(),
        line2: formData.addressLine2.trim(),
      }),
    );
    if (selectedImage) {
      data.append("image", selectedImage);
    }
    const result = await dispatch(updateProfile(data));
    if (updateProfile.fulfilled.match(result)) {
      setOpenModal(false);
      setSelectedImage(null);
      dispatch(getProfile());
    }
  };

  // --loading-state--

  if (profileLoading && !user) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 shadow-xl p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Loader2 size={30} className="text-blue-600 animate-spin" />
          </div>
          <h2 className="mt-5 text-lg font-extrabold text-slate-900">
            Loading Profile
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Please wait while we load your profile information.
          </p>
        </div>
      </div>
    );
  }

  // --no-user--
  if (!user) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-xl p-8 text-center">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center">
            <User size={36} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-6">
            Profile Not Found
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-6">
            We could not load your profile information. Please try again.
          </p>
          <button
            className="mt-6 w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 cursor-pointer"
            type="button"
            onClick={() => dispatch(getProfile())}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-[#f6f8fc] py-5 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
          {/* --profile-hero-- */}
          <section className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] bg-white border border-slate-200 shadow-sm">
            {/* --background-decoration-- */}
            <div className="absolute inset-x-0 top-0 h-36 sm:h-44 lg:h-48 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500" />
            <div className="absolute -right-20 -top-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute right-10 top-20 w-24 h-24 rounded-full bg-cyan-300/10 blur-2xl" />
            {/* --hero-content-- */}
            <div className="relative pt-20 sm:pt-24 lg:pt-28 px-4 sm:px-7 lg:px-10 pb-6 sm:pb-8">
              <div className="flex flex-col lg:flex-row lg:items-end gap-5 sm:gap-6">
                {/* --profile-image-- */}
                <div className="relative shrink-0 self-center lg:self-auto">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-[26px] sm:rounded-[30px] bg-white p-1.5 shadow-2xl">
                    <img
                      className="w-full h-full rounded-[21px] sm:rounded-[24px] object-cover"
                      src={
                        user.image ||
                        "https://via.placeholder.com/300x300?text=User"
                      }
                      alt=""
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-500 border-4 border-white flex items-center justify-center shadow-lg">
                    <CheckCircle2
                      size={17}
                      className="text-white sm:w-5 sm:h-5"
                    />
                  </div>
                </div>
                {/* --user-information-- */}
                <div className="flex-1 min-w-0 text-center lg:text-left">
                  <div className="flex flex-col sm:flex-row items-center lg:items-center lg:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-slate-900 break-words max-w-full">
                      {user.name || "Patient"}
                    </h1>
                    <span className="inline-flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] sm:text-xs font-bold">
                      <ShieldCheck size={24} />
                      Verified Payment
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <p className="flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-500 break-all">
                      <Mail size={16} className="shrink-0 text-slate-400" />
                      <span>{user.email}</span>
                    </p>
                    <p className="flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-500">
                      <Phone size={16} className="shrink-0 text-slate-400" />
                      <span>{user.phone || "Phone Not Added"}</span>
                    </p>
                  </div>
                </div>
                {/* --edit-button-- */}
                <div className="w-full lg:w-auto">
                  <button
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-blue-600 transition shadow-lg cursor-pointer"
                    type="button"
                    onClick={handleOpenModal}
                  >
                    <Edit3 size={17} />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </section>
          {/* --content-grid-- */}
          <section className="mt-5 sm:mt-7">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
              {/* user-information-- */}
              <div className="xl:col-span-2 bg-white rounded-[24px] sm:rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 sm:px-7 py-5 sm:py-6 border-b border-slate-100">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs uppercase tracking-[0.18em] font-extrabold text-blue-600">
                        Personal Details
                      </p>
                      <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-1">
                        Account Information
                      </h2>
                    </div>
                    <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
                      <User size={20} className="text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6 lg:p-7 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <InfoCard
                    icon={<User size={18} />}
                    label="Full Name"
                    value={user.name || "Not Added"}
                  />
                  <InfoCard
                    icon={<Mail size={18} />}
                    label="Email Address"
                    value={user.email || "Not Added"}
                  />
                  <InfoCard
                    icon={<Phone size={18} />}
                    label="Phone Number"
                    value={user.phone || "Not Added"}
                  />
                  <InfoCard
                    icon={<VenusAndMars size={18} />}
                    label="Gender"
                    value={user.gender || "Not Added"}
                  />
                  <InfoCard
                    icon={<CalendarDays size={18} />}
                    label="Date Of Birth"
                    value={
                      user.dob
                        ? new Date(user.dob).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : "Not Added"
                    }
                  />
                  <InfoCard
                    icon={<ShieldCheckIcon size={18} />}
                    label="Account Role"
                    value={user.role || "Not Added"}
                  />
                </div>
              </div>
              {/* --address-card-- */}
              <div className="bg-white rounded-[24px] sm:rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 sm:px-6 py-5 sm:py-6 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center">
                        <MapPin size={21} className="text-cyan-600" />
                      </div>
                      <p className="text-[10px] sm:text-xs uppercase tracking-[0.18em] font-extrabold text-cyan-600 mt-5">
                        Location
                      </p>
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                        Your Address
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  {user.address?.line1 || user.address?.line2 ? (
                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4">
                        <MapPin size={19} className="text-cyan-600" />
                      </div>
                      {user.address?.line1 && (
                        <p className="font-bold text-slate-900 break-words">
                          {user.address.line1}
                        </p>
                      )}
                      {user.address?.line2 && (
                        <p className="text-sm text-slate-500 mt-1.5 break-words">
                          {user.address.line2}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-slate-50 border border-dashed border-slate-200 p-6 text-center">
                      <MapPin size={28} className="mx-auto text-slate-300" />
                      <p className="font-bold text-slate-700 mt-3">
                        No Address Added
                      </p>
                      <p className="text-sm text-slate-400 mt-1 leading-5">
                        Add your address to complete your profile.
                      </p>
                    </div>
                  )}
                  <button
                    className="w-full mt-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600 transition cursor-pointer"
                    type="button"
                    onClick={handleOpenModal}
                  >
                    Update Address
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section className="mt-5 sm:mt-6 pb-6 sm:pb-10">
            <div className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-5 sm:p-7 lg:p-8">
              <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="absolute -left-20 -bottom-24 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl" />
              <div className="relative flex flex-col md:flex-row md:items-center gap-5">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <LockKeyhole size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-lg">
                      Your Account Is Protected
                    </h3>
                    <Sparkles size={17} className="text-cyan-300" />
                  </div>
                  <p className="text-sm text-slate-300 mt-2 leading-6 max-w-3xl">
                    Your personal information is securely managed through
                    authenticated access. Email and password are protected and
                    cannot be changed from this profile form.
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-400/20 text-emerald-300 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Secure Account
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* profile-modal-- */}
      {openModal && (
        <div className="fixed inset-0 z-[100]">
          <div
            onClick={handleCloseModal}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full h-full flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="relative w-full sm:max-w-2xl max-h-[96vh] sm:max-h-[92vh] overflow-hidden rounded-t-[28px] sm:rounded-[30px] bg-white shadow-2xl">
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 px-5 sm:px-7 py-5 sm:py-7 text-white">
                <div className="absolute -right-10 -top-20 w-52 h-52 rounded-full bg-white/10 blur-3xl" />
                <div className="relative flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                      <Edit3 size={21} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-blue-100 font-bold">
                        Profile Settings
                      </p>
                      <h2 className="text-lg sm:text-2xl font-extrabold mt-0.5 truncate">
                        Update Your Profile
                      </h2>
                    </div>
                  </div>
                  <button
                    className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition cursor-pointer disabled:opacity-50"
                    type="button"
                    onClick={handleCloseModal}
                    disabled={profileLoading}
                  >
                    <X size={19} />
                  </button>
                </div>
              </div>
              {/* --form-- */}
              <form
                onSubmit={handleUpdateProfile}
                className="flex flex-col max-h-[calc(96vh-88px)] sm:max-h-[calc(92vh-120px)]"
              >
                <div className="overflow-y-auto flex-1">
                  <div className="p-5 sm:p-7">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 pb-6 border-b border-slate-100">
                      <div className="relative shrink-0">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[24px] overflow-hidden border-4 border-white shadow-xl ring-1 ring-slate-200">
                          <img
                            className="w-full h-full object-cover"
                            src={
                              imagePreview ||
                              "https://via.placeholder.com/300x300?text=User"
                            }
                            alt=""
                          />
                        </div>
                        <button
                          className="absolute -right-2 -bottom-2 w-10 h-10 rounded-xl bg-blue-600 text-white border-4 border-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                          type="button"
                        >
                          <Camera size={17} />
                        </button>
                      </div>
                      <div className="text-center sm:text-left min-w-0">
                        <h3 className="font-extrabold text-slate-900">
                          Profile Photo
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 leading-5">
                          Upload a clear photo for your patient profile.
                        </p>
                        <button
                          className="mt-3 text-sm font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Choose New Photo
                        </button>
                        <p className="text-[11px] text-slate-400 mt-1">
                          JPG, PNG or WEBP • Max 5MB
                        </p>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-6">
                      <FormField
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        icon={<User size={18} />}
                        placeholder="Enter Your Full Name"
                      />
                      <FormField
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        icon={<Phone size={18} />}
                        placeholder="Enter Your Phone Number"
                      />
                      <FormField
                        label="Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        icon={<VenusAndMars size={18} />}
                        select
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </FormField>
                      <FormField label="Date Of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} icon={<CalendarDays size={18}/>}/>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                        <div className="relative">
                         <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                         <input className="w-full h-12 rounded-xl border border-slate-200 bg-slate-100 pl-11 pr-11 text-sm font-semibold text-slate-500 outline-none cursor-not-allowed truncate" type="email" value={user.email || ""} disabled />
                         <LockKeyhole size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-400 mt-1.5">
                            Email address cannot be changed from profile settings.
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                       <label className="block text-sm font-bold text-slate-700 mb-2">
                        Address Line 1
                       </label>
                       <div className="relative">
                        <MapPin size={18} className="absolute left-4 top-4 text-slate-400"/>
                        <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Enter Address Line 1" className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                       </div>
                      </div>
                      <div className="sm:col-span-2">
                       <label className="block text-sm font-bold text-slate-700 mb-2">
                        Address Line 2
                       </label>
                       <div className="relative">
                        <MapPin size={18} className="absolute left-4 top-4 text-slate-400"/>
                        <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Enter Address Line 2" className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                       </div>
                      </div>
                    </div>
                    <div className="mt-5 flex items-start gap-3 rounded-2xl bg-blue-50 border border-blue-100 p-4">
                     <ShieldCheck size={19} className="text-blue-600 shrink-0 mt-0.5"/>
                     <p className="text-xs sm:text-sm text-blue-700 leading-5 sm:leading-6">
                        Your information is securely stored. Only the
                        information supported by your account settings can
                        be updated here.
                    </p>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 bg-white border-t border-slate-100 px-5 sm:px-7 py-4 sm:py-5">
                 <div className="flex flex-col-reverse sm:flex-row gap-3">
                  <button className="w-full sm:flex-1 h-12 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition cursor-pointer disabled:opacity-50" type="button" onClick={handleCloseModal} disabled={profileLoading}>
                    Cancel
                  </button>
                  <button type="submit" disabled={profileLoading} className="w-full sm:flex-1 h-12 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                   {profileLoading ? (
                    <>
                    <Loader2 size={18} className="animate-spin"/>
                    Saving Changes...
                    </>
                   ):(
                    <>
                    <Save size={18}/>
                    Save Changes
                    </>
                   )}
                  </button>
                 </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Myprofile;
