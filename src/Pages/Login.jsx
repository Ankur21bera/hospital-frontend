import React, { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartPulse,
  KeyRound,
  LockKeyhole,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
  User,
  UserRound,
  VenusAndMars,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  clearUserError,
  clearUserMessage,
  forgotPassword,
  loginUser,
  registerUser,
  resendOtp,
  resetPassword,
  resetUserSuccessStates,
  verifyOtp,
} from "../Redux/Slice/userSlice";

const PasswordInput = ({
  value,
  onChange,
  placeholder = "Enter your password",
  name = "password",
  error = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <LockKeyhole
        size={18}
        className={`absolute left-4 top-1/2 -translate-y-1/2 ${
          error ? "text-red-400" : "text-slate-400"
        }`}
      />

      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="current-password"
        className={`w-full h-13 pl-11 pr-12 rounded-xl border ${
          error
            ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/10"
            : "border-slate-200 bg-slate-50/70 focus:border-blue-500 focus:bg-white focus:ring-blue-500/10"
        } text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4`}
      />

      <button
        type="button"
        onClick={() =>
          setShowPassword((prev) => !prev)
        }
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition cursor-pointer"
      >
        {showPassword ? (
          <EyeOff size={18} />
        ) : (
          <Eye size={18} />
        )}
      </button>
    </div>
  );
};


const AuthInput = ({
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  error = false,
  maxLength,
}) => {
  return (
    <div className="relative">
      <Icon
        size={18}
        className={`absolute left-4 top-1/2 -translate-y-1/2 ${
          error ? "text-red-400" : "text-slate-400"
        }`}
      />

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={`w-full h-13 pl-11 pr-4 rounded-xl border ${
          error
            ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/10"
            : "border-slate-200 bg-slate-50/70 focus:border-blue-500 focus:bg-white focus:ring-blue-500/10"
        } text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4`}
      />
    </div>
  );
};


const OtpInput = ({ otp, setOtp }) => {
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const otpArray = otp.split("");

    while (otpArray.length < 6) {
      otpArray.push("");
    }

    otpArray[index] = digit;

    const newOtp = otpArray.join("").slice(0, 6);

    setOtp(newOtp);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowLeft" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowRight" &&
      index < 5
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(pastedValue);

    const focusIndex = Math.min(
      pastedValue.length,
      5
    );

    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index] || ""}
          onChange={(event) =>
            handleChange(event.target.value, index)
          }
          onKeyDown={(event) =>
            handleKeyDown(event, index)
          }
          onPaste={handlePaste}
          className="w-11 h-13 sm:w-14 sm:h-14 rounded-xl border border-slate-200 bg-slate-50 text-center text-lg sm:text-xl font-extrabold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
        />
      ))}
    </div>
  );
};

const PrimaryButton = ({
  children,
  loading,
  type = "submit",
  onClick,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="w-full h-13 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-sm shadow-lg shadow-blue-200/60 hover:from-blue-700 hover:to-cyan-700 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <RefreshCw
            size={18}
            className="animate-spin"
          />
          Please wait...
        </>
      ) : (
        children
      )}
    </button>
  );
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    authLoading,
    authError,
    message,
    registerSuccess,
    forgotPasswordSuccess,
    otpVerified,
    resetPasswordSuccess,
  } = useSelector((state) => state.user);

  const [mode, setMode] = useState("login");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
  });

  const [forgotEmail, setForgotEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [resetForm, setResetForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [resendTimer, setResendTimer] = useState(60);
  const [errors, setErrors] = useState({});
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  const isValidPassword = (password) => {
    return password.length >= 8;
  };

  const clearFieldError = (field) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };
  useEffect(() => {
    if (mode !== "otp") return;
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) =>
        prev > 0 ? prev - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, resendTimer]);
  useEffect(() => {
    if (authError) {
      toast.error(authError);
      dispatch(clearUserError());
    }
  }, [authError, dispatch]);

  useEffect(()=>{
    window.scrollTo(0,0)
  },[])

  useEffect(() => {
    if (registerSuccess) {
      toast.success(
        message || "Registration successful"
      );
      dispatch(resetUserSuccessStates());
      setMode("login");
      setLoginForm({
        email: registerForm.email,
        password: "",
      });
      setErrors({});
    }
  }, [
    registerSuccess,
    message,
    dispatch,
    registerForm.email,
  ]);
  useEffect(() => {
    if (forgotPasswordSuccess) {
      toast.success(
        message || "OTP sent successfully"
      );
      dispatch(resetUserSuccessStates());
      setMode("otp");
      setOtp("");
      setResendTimer(60);
      setErrors({});
    }
  }, [
    forgotPasswordSuccess,
    message,
    dispatch,
  ]);
  useEffect(() => {
    if (otpVerified) {
      toast.success(
        message || "OTP verified successfully"
      );
      dispatch(resetUserSuccessStates());
      setResetForm({
        email: forgotEmail,
        password: "",
        confirmPassword: "",
      });
      setMode("reset");
      setErrors({});
    }
  }, [
    otpVerified,
    message,
    dispatch,
    forgotEmail,
  ]);
  useEffect(() => {
    if (resetPasswordSuccess) {
      toast.success(
        message || "Password reset successfully"
      );
      dispatch(resetUserSuccessStates());
      setMode("login");
      setLoginForm({
        email: forgotEmail,
        password: "",
      });
      setForgotEmail("");
      setOtp("");
      setErrors({});
    }
  }, [
    resetPasswordSuccess,
    message,
    dispatch,
    forgotEmail,
  ]);
  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    clearFieldError(name);
  };
  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    let updatedValue = value;
    if (name === "phone") {
      updatedValue = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }
    setRegisterForm((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
    clearFieldError(name);
  };

  const handleResetChange = (event) => {
    const { name, value } = event.target;
    setResetForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    clearFieldError(name);
  };
  const validateLogin = () => {
    const newErrors = {};
    if (!loginForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(loginForm.email)) {
      newErrors.email =
        "Please enter a valid email address";
    }
    if (!loginForm.password) {
      newErrors.password =
        "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!registerForm.name.trim()) {
      newErrors.name = "Name is required";
    } else if (
      registerForm.name.trim().length < 2
    ) {
      newErrors.name =
        "Name must contain at least 2 characters";
    }
    if (!registerForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !isValidEmail(registerForm.email)
    ) {
      newErrors.email =
        "Please enter a valid email address";
    }
    if (!registerForm.password) {
      newErrors.password =
        "Password is required";
    } else if (
      !isValidPassword(registerForm.password)
    ) {
      newErrors.password =
        "Password must contain at least 8 characters";
    }
    if (!registerForm.phone) {
      newErrors.phone =
        "Mobile number is required";
    } else if (
      !isValidPhone(registerForm.phone)
    ) {
      newErrors.phone =
        "Please enter a valid 10-digit mobile number";
    }

    if (!registerForm.gender) {
      newErrors.gender =
        "Please select your gender";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    if (!validateLogin()) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    const result = await dispatch(
      loginUser({
        email: loginForm.email.trim().toLowerCase(),
        password: loginForm.password,
      })
    );
    if (loginUser.fulfilled.match(result)) {
      const backendMessage =
        result.payload?.message ||
        "Login successful";
      toast.success(backendMessage);
      dispatch(resetUserSuccessStates());
      navigate("/", {
        replace: true,
      });
    }
  };
  const handleRegister = (event) => {
    event.preventDefault();
    if (!validateRegister()) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    dispatch(
      registerUser({
        ...registerForm,
        name: registerForm.name.trim(),
        email: registerForm.email
          .trim()
          .toLowerCase(),
      })
    );
  };
  const handleForgotPassword = (event) => {
    event.preventDefault();
    const email = forgotEmail.trim().toLowerCase();
    if (!email) {
      setErrors({
        forgotEmail: "Email is required",
      });
      toast.error("Please enter your email");
      return;
    }
    if (!isValidEmail(email)) {
      setErrors({
        forgotEmail:
          "Please enter a valid email address",
      });
      toast.error(
        "Please enter a valid email address"
      );
      return;
    }
    setErrors({});
    setForgotEmail(email);
    dispatch(forgotPassword(email));
  };

  const handleVerifyOtp = (event) => {
    event.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      toast.error(
        "OTP must contain exactly 6 digits"
      );
      return;
    }
    dispatch(
      verifyOtp({
        email: forgotEmail,
        otp,
      })
    );
  };

  const handleResendOtp = () => {
    if (resendTimer > 0 || authLoading) {
      return;
    }
    dispatch(resendOtp(forgotEmail));
    setOtp("");
    setResendTimer(60);
  };
  const handleResetPassword = (event) => {
    event.preventDefault();
    const newErrors = {};
    if (!resetForm.password) {
      newErrors.password =
        "New password is required";
    } else if (
      resetForm.password.length < 8
    ) {
      newErrors.password =
        "Password must contain at least 8 characters";
    }
    if (!resetForm.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      resetForm.password !==
      resetForm.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    dispatch(resetPassword(resetForm));
  };
  const changeMode = (newMode) => {
    dispatch(clearUserError());
    dispatch(clearUserMessage());
    dispatch(resetUserSuccessStates());
    setErrors({});
    setMode(newMode);
  };

  const getHeader = () => {
    if (mode === "login") {
      return {
        title: "Welcome Back",
        description:
          "Sign in to continue to your healthcare account.",
        icon: <HeartPulse size={24} />,
      };
    }

    if (mode === "register") {
      return {
        title: "Create Your Account",
        description:
          "Join our secure healthcare management platform.",
        icon: <UserRound size={24} />,
      };
    }

    if (mode === "forgot") {
      return {
        title: "Forgot Password?",
        description:
          "Enter your registered email to receive an OTP.",
        icon: <KeyRound size={24} />,
      };
    }

    if (mode === "otp") {
      return {
        title: "Verify OTP",
        description:
          "Enter the 6-digit OTP sent to your email.",
        icon: <ShieldCheck size={24} />,
      };
    }

    return {
      title: "Reset Password",
      description:
        "Create a new secure password for your account.",
      icon: <LockKeyhole size={24} />,
    };
  };

  const header = getHeader();
  return (
    <div className="min-h-[calc(100vh-76px)] bg-slate-50 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-[0_25px_80px_-25px_rgba(15,23,42,0.25)] border border-slate-200">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 xl:p-12 text-white">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10" />

            <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-white/10" />

            <div className="relative z-10 flex flex-col justify-between w-full">
              <div>

                <div className="flex items-center gap-3 mb-12">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <HeartPulse size={27} />
                  </div>

                  <div>
                    <p className="text-xl font-extrabold tracking-tight">
                      Prescripto
                    </p>

                    <p className="text-[10px] uppercase tracking-[0.2em] text-blue-100 font-bold">
                      Healthcare Management
                    </p>
                  </div>
                </div>

                <div className="max-w-md">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold mb-5">
                    <Activity size={14} />
                    Smart Healthcare Platform
                  </div>

                  <h1 className="text-4xl xl:text-5xl font-black leading-[1.08] tracking-tight">
                    Healthcare,
                    <br />
                    made simpler.
                  </h1>

                  <p className="mt-5 text-blue-100 leading-7 text-sm xl:text-base max-w-sm">
                    Manage appointments, connect with doctors,
                    and keep your healthcare journey organized
                    from one secure platform.
                  </p>
                </div>

                <div className="mt-10 space-y-4">

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                      <Stethoscope size={19} />
                    </div>

                    <div>
                      <p className="font-bold text-sm">
                        Trusted Healthcare
                      </p>

                      <p className="text-xs text-blue-100 mt-0.5">
                        Access professional medical services
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                      <CalendarDaysIcon />
                    </div>

                    <div>
                      <p className="font-bold text-sm">
                        Easy Appointments
                      </p>

                      <p className="text-xs text-blue-100 mt-0.5">
                        Book and manage appointments easily
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                      <ShieldCheck size={19} />
                    </div>

                    <div>
                      <p className="font-bold text-sm">
                        Secure & Private
                      </p>

                      <p className="text-xs text-blue-100 mt-0.5">
                        Your healthcare data stays protected
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-blue-100">
                <span>© 2026 Prescripto</span>

                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} />
                  Secure Portal
                </span>
              </div>
            </div>
          </div>
          <div className="p-5 sm:p-8 lg:p-10 xl:p-12">

            {/* MOBILE BRAND */}

            <div className="lg:hidden flex items-center justify-center mb-8">
              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-200">
                  <HeartPulse
                    size={24}
                    className="text-white"
                  />
                </div>

                <div>
                  <p className="text-lg font-extrabold text-slate-900">
                    Prescripto
                  </p>

                  <p className="text-[9px] uppercase tracking-[0.17em] font-bold text-slate-400">
                    Healthcare Management
                  </p>
                </div>

              </div>
            </div>

            <div className="max-w-xl mx-auto">

              {/* HEADER */}

              <div className="mb-7">

                <div className="flex items-center gap-3 mb-5">

                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    {header.icon}
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                      {header.title}
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      {header.description}
                    </p>
                  </div>

                </div>

                {/* PROGRESS */}

                <div className="flex items-center gap-1.5">
                  {[
                    "login",
                    "register",
                    "forgot",
                    "otp",
                    "reset",
                  ].map((item) => (
                    <div
                      key={item}
                      className={`h-1 rounded-full flex-1 transition ${
                        mode === item
                          ? "bg-blue-600"
                          : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {mode === "login" && (
                <form
                  onSubmit={handleLogin}
                  className="space-y-5"
                >

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Email Address
                    </label>

                    <AuthInput
                      icon={Mail}
                      type="email"
                      name="email"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      placeholder="Enter your email"
                      autoComplete="email"
                      error={Boolean(errors.email)}
                    />

                    {errors.email && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Password
                    </label>

                    <PasswordInput
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      name="password"
                      placeholder="Enter your password"
                      error={Boolean(errors.password)}
                    />

                    {errors.password && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        changeMode("forgot")
                      }
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <PrimaryButton loading={authLoading}>
                    Sign In
                    <ArrowRight size={17} />
                  </PrimaryButton>

                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>

                    <div className="relative flex justify-center">
                      <span className="bg-white px-3 text-xs text-slate-400">
                        New to Prescripto?
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      changeMode("register")
                    }
                    className="w-full h-13 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600 transition cursor-pointer"
                  >
                    Create New Account
                  </button>

                </form>
              )}
              {mode === "register" && (
                <form
                  onSubmit={handleRegister}
                  className="space-y-4"
                >

                  <div className="grid sm:grid-cols-2 gap-4">

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Full Name
                      </label>

                      <AuthInput
                        icon={User}
                        name="name"
                        value={registerForm.name}
                        onChange={handleRegisterChange}
                        placeholder="Your full name"
                        autoComplete="name"
                        error={Boolean(errors.name)}
                      />

                      {errors.name && (
                        <p className="mt-1.5 text-xs font-medium text-red-500">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Mobile Number
                      </label>

                      <AuthInput
                        icon={Phone}
                        type="tel"
                        name="phone"
                        value={registerForm.phone}
                        onChange={handleRegisterChange}
                        placeholder="10-digit mobile"
                        autoComplete="tel"
                        maxLength={10}
                        error={Boolean(errors.phone)}
                      />

                      {errors.phone && (
                        <p className="mt-1.5 text-xs font-medium text-red-500">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Email Address
                    </label>

                    <AuthInput
                      icon={Mail}
                      type="email"
                      name="email"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      placeholder="Enter your email"
                      autoComplete="email"
                      error={Boolean(errors.email)}
                    />

                    {errors.email && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Password
                    </label>

                    <PasswordInput
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      name="password"
                      placeholder="Create a password"
                      error={Boolean(errors.password)}
                    />

                    {errors.password && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.password}
                      </p>
                    )}

                    <p className="mt-1.5 text-[11px] text-slate-400">
                      Password must contain at least 8 characters.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Gender
                    </label>

                    <div className="relative">
                      <VenusAndMars
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <select
                        name="gender"
                        value={registerForm.gender}
                        onChange={handleRegisterChange}
                        className={`w-full h-13 pl-11 pr-4 rounded-xl border ${
                          errors.gender
                            ? "border-red-300 bg-red-50/50"
                            : "border-slate-200 bg-slate-50/70"
                        } text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition`}
                      >
                        <option value="">
                          Select your gender
                        </option>

                        <option value="Male">
                          Male
                        </option>

                        <option value="Female">
                          Female
                        </option>

                        <option value="Other">
                          Other
                        </option>
                      </select>
                    </div>

                    {errors.gender && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.gender}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <PrimaryButton loading={authLoading}>
                      Create Account
                      <ArrowRight size={17} />
                    </PrimaryButton>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      changeMode("login")
                    }
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition cursor-pointer"
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </button>

                </form>
              )}
              {mode === "forgot" && (
                <form
                  onSubmit={handleForgotPassword}
                  className="space-y-5"
                >

                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3">
                    <ShieldCheck
                      size={20}
                      className="text-blue-600 shrink-0"
                    />

                    <p className="text-xs leading-5 text-blue-700">
                      Enter the email address associated with
                      your account. We will send you a 6-digit
                      verification OTP.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Registered Email
                    </label>

                    <AuthInput
                      icon={Mail}
                      type="email"
                      name="forgotEmail"
                      value={forgotEmail}
                      onChange={(event) => {
                        setForgotEmail(
                          event.target.value
                        );

                        clearFieldError("forgotEmail");
                      }}
                      placeholder="Enter your registered email"
                      autoComplete="email"
                      error={Boolean(
                        errors.forgotEmail
                      )}
                    />

                    {errors.forgotEmail && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.forgotEmail}
                      </p>
                    )}
                  </div>

                  <PrimaryButton loading={authLoading}>
                    Send OTP
                    <ArrowRight size={17} />
                  </PrimaryButton>

                  <button
                    type="button"
                    onClick={() =>
                      changeMode("login")
                    }
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition cursor-pointer"
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </button>

                </form>
              )}
              {mode === "otp" && (
                <form
                  onSubmit={handleVerifyOtp}
                  className="space-y-6"
                >

                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                      <ShieldCheck size={30} />
                    </div>

                    <p className="text-sm text-slate-500">
                      OTP sent to
                    </p>

                    <p className="text-sm font-extrabold text-slate-900 mt-1 break-all">
                      {forgotEmail}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-3 text-center">
                      Enter 6-Digit OTP
                    </label>

                    <OtpInput
                      otp={otp}
                      setOtp={setOtp}
                    />
                  </div>

                  <PrimaryButton loading={authLoading}>
                    Verify OTP
                    <CheckCircle2 size={17} />
                  </PrimaryButton>

                  <div className="text-center">
                    {resendTimer > 0 ? (
                      <p className="text-xs text-slate-400">
                        Resend OTP{" "}
                        <span className="font-extrabold text-blue-600">
                          {resendTimer}s
                        </span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={authLoading}
                        className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 disabled:opacity-50 cursor-pointer"
                      >
                        <RefreshCw size={14} />
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      changeMode("forgot")
                    }
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition cursor-pointer"
                  >
                    <ArrowLeft size={16} />
                    Change Email
                  </button>

                </form>
              )}
              {mode === "reset" && (
                <form
                  onSubmit={handleResetPassword}
                  className="space-y-5"
                >

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex gap-3">
                    <CheckCircle2
                      size={20}
                      className="text-emerald-600 shrink-0"
                    />

                    <p className="text-xs leading-5 text-emerald-700">
                      Your OTP has been verified successfully.
                      You can now create a new password.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      New Password
                    </label>

                    <PasswordInput
                      value={resetForm.password}
                      onChange={handleResetChange}
                      name="password"
                      placeholder="Enter new password"
                      error={Boolean(errors.password)}
                    />

                    {errors.password && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Confirm New Password
                    </label>

                    <PasswordInput
                      value={resetForm.confirmPassword}
                      onChange={handleResetChange}
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      error={Boolean(
                        errors.confirmPassword
                      )}
                    />

                    {errors.confirmPassword && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <PrimaryButton loading={authLoading}>
                    Reset Password
                    <CheckCircle2 size={17} />
                  </PrimaryButton>

                </form>
              )}

              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck
                    size={14}
                    className="text-emerald-500"
                  />
                  Secure & encrypted healthcare portal
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CalendarDaysIcon = () => {
  return (
    <div className="relative">
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 2v4" />
        <path d="M16 2v4" />

        <rect
          width="18"
          height="18"
          x="3"
          y="4"
          rx="2"
        />

        <path d="M3 10h18" />

        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />

        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
        <path d="M16 18h.01" />
      </svg>
    </div>
  );
};
export default Login;