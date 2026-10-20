import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  FileText,
  Filter,
  HeartPulse,
  IndianRupee,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

import {
  listAppointment,
  cancelAppointment,
  requestOfflinePayment,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createStripeCheckoutSession,
  verifyStripePayment,
  resetUserSuccessStates,
} from "../Redux/Slice/userSlice";

const formatDate = (dateString) => {
  if (!dateString) return "Date not available";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getAppointmentStatus = (appointment) => {
  if (appointment.cancelled) return "Cancelled";
  if (appointment.isCompleted) return "Completed";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const appointmentDate = new Date(`${appointment.slotDate}T00:00:00`);
  if (!Number.isNaN(appointmentDate.getTime()) && appointmentDate < today) {
    return "Past";
  }
  return "Upcoming";
};

const getPaymentStatus = (appointment) => {
  if (appointment.payment || appointment.paymentStatus === "paid") {
    return "Paid";
  }
  if (appointment.paymentStatus === "requested") {
    return "Offline Requested";
  }
  return "Pending";
};
const getDoctor = (appointment) => {
  return appointment.docData || {};
};
const getDoctorId = (appointment) => {
  return typeof appointment.docId === "object"
    ? appointment.docId?._id
    : appointment.docId;
};

const getStatusClasses = (status) => {
  const styles = {
    Upcoming: "bg-blue-50 text-blue-700 border-blue-100",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Cancelled: "bg-red-50 text-red-700 border-red-100",
    Past: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return styles[status] || "bg-slate-50 text-slate-600 border-slate-200";
};

const getPaymentClasses = (status) => {
  const styles = {
    Paid: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    "Offline Requested": "bg-violet-50 text-violet-700",
  };

  return styles[status] || "bg-slate-100 text-slate-600";
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const ConfirmModal = ({ modal, onClose, onConfirm, loading }) => {
  if (!modal) return null;
  const isDanger = modal.type === "cancel";
  const isPayment = modal.type === "payment";
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-2xl">
        <div
          className={`relative overflow-hidden px-6 pb-6 pt-7 ${
            isDanger
              ? "bg-gradient-to-br from-red-50 via-white to-orange-50"
              : isPayment
                ? "bg-gradient-to-br from-indigo-50 via-white to-violet-50"
                : "bg-gradient-to-br from-blue-50 via-white to-cyan-50"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          <div
            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
              isDanger
                ? "bg-red-100 text-red-600"
                : isPayment
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-blue-100 text-blue-600"
            }`}
          >
            {isDanger ? (
              <XCircle size={28} />
            ) : isPayment ? (
              <CreditCard size={27} />
            ) : (
              <CalendarDays size={27} />
            )}
          </div>

          <h2 className="pr-8 text-2xl font-extrabold tracking-tight text-slate-900">
            {modal.title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {modal.description}
          </p>
        </div>

        {modal.appointment && (
          <div className="mx-6 mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <img
                src={
                  getDoctor(modal.appointment).image ||
                  "https://placehold.co/100x100?text=Doctor"
                }
                alt={getDoctor(modal.appointment).name || "Doctor"}
                className="h-14 w-14 rounded-xl border border-white object-cover shadow-sm"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-slate-900">
                  {getDoctor(modal.appointment).name ||
                    "Doctor details unavailable"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {formatDate(modal.appointment.slotDate)}
                  {" · "}
                  {modal.appointment.slotTime}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="text-sm text-slate-500">Appointment fee</span>
              <span className="text-lg font-extrabold text-slate-900">
                ₹{modal.appointment.amount ?? 0}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-3 border-t border-slate-100 p-6 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl cursor-pointer border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {modal.cancelText || "Go Back"}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex flex-1 items-center justify-center cursor-pointer gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isDanger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}

            {loading ? "Please wait..." : modal.confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AppointmentCard = ({
  appointment,
  onCancel,
  onReschedule,
  onPay,
  onOfflinePayment,
  actionLoading,
}) => {
  const doctor = getDoctor(appointment);
  const status = getAppointmentStatus(appointment);
  const paymentStatus = getPaymentStatus(appointment);

  const canManage = status === "Upcoming" && !appointment.isCompleted;
  const canPay = canManage && paymentStatus !== "Paid";
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/5">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="relative mx-auto h-28 w-28 shrink-0 sm:mx-0 sm:h-32 sm:w-32">
            <img
              src={doctor.image || "https://placehold.co/300x300?text=Doctor"}
              alt={doctor.name || "Doctor"}
              className="h-full w-full rounded-2xl border border-slate-100 bg-slate-50 object-cover"
            />

            {doctor.available && (
              <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white">
                <Check size={14} strokeWidth={3} />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">
                  {doctor.speciality || "Medical Specialist"}
                </p>

                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  {doctor.name || "Doctor details unavailable"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {doctor.degree || "Qualified Medical Professional"}
                  {doctor.experience
                    ? ` · ${doctor.experience} experience`
                    : ""}
                </p>
              </div>

              <span
                className={`mx-auto inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold sm:mx-0 ${getStatusClasses(
                  status,
                )}`}
              >
                {status === "Completed" ? (
                  <CheckCircle2 size={14} />
                ) : status === "Cancelled" ? (
                  <XCircle size={14} />
                ) : (
                  <CalendarDays size={14} />
                )}

                {status}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <CalendarDays size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Appointment Date
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-slate-800">
                    {formatDate(appointment.slotDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                  <Clock3 size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Appointment Time
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-slate-800">
                    {appointment.slotTime || "Time unavailable"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${getPaymentClasses(
                  paymentStatus,
                )}`}
              >
                {paymentStatus === "Paid" ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <Wallet size={13} />
                )}

                {paymentStatus}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-600">
                {appointment.paymentMethod === "razorpay"
                  ? "Razorpay"
                  : appointment.paymentMethod === "stripe"
                    ? "Stripe"
                    : appointment.paymentMethod === "offline"
                      ? "Offline"
                      : "Online payment"}
              </span>

              {doctor.address?.line1 && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <MapPin size={13} />
                  {[doctor.address.line1, doctor.address.line2]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">
              Consultation Fee
            </p>

            <p className="mt-1 flex items-center gap-1 text-2xl font-extrabold tracking-tight text-slate-900">
              <IndianRupee size={20} />
              {appointment.amount ?? 0}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
            {canManage && (
              <>
                <button
                  type="button"
                  onClick={() => onReschedule(appointment)}
                  disabled={actionLoading}
                  className="inline-flex items-center justify-center cursor-pointer gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50"
                >
                  <RefreshCw size={15} />
                  Reschedule
                </button>

                <button
                  type="button"
                  onClick={() => onCancel(appointment)}
                  disabled={actionLoading}
                  className="inline-flex items-center cursor-pointer justify-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <X size={16} />
                  Cancel
                </button>
              </>
            )}

            {canPay && (
              <>
                <button
                  type="button"
                  onClick={() => onOfflinePayment(appointment)}
                  disabled={
                    actionLoading || paymentStatus === "Offline Requested"
                  }
                  className="inline-flex items-center justify-center cursor-pointer gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <Wallet size={16} />
                  {paymentStatus === "Offline Requested"
                    ? "Request Sent"
                    : "Pay Offline"}
                </button>

                <button
                  type="button"
                  onClick={() => onPay(appointment)}
                  disabled={actionLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 cursor-pointer px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  <CreditCard size={16} />
                  Pay Online
                  <ArrowRight size={15} />
                </button>
              </>
            )}

            {status === "Completed" && (
              <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700">
                <CheckCircle2 size={17} />
                Appointment Completed
              </span>
            )}

            {status === "Cancelled" && (
              <span className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600">
                <XCircle size={17} />
                Appointment Cancelled
              </span>
            )}

            {status === "Past" && (
              <span className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-700">
                <Clock3 size={17} />
                Date Has Passed
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};


const Myappointment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    appointments = [],
    appointmentsLoading,
    appointmentsError,
    paymentLoading,
  } = useSelector((state) => state.user);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  useEffect(() => {
    dispatch(listAppointment());
  }, [dispatch]);


  const filteredAppointments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return appointments.filter((appointment) => {
      const doctor = getDoctor(appointment);
      const status = getAppointmentStatus(appointment);
      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Upcoming" && status === "Upcoming") ||
        (activeFilter === "Completed" && status === "Completed") ||
        (activeFilter === "Cancelled" && status === "Cancelled");
      const matchesSearch =
        !query ||
        (doctor.name || "").toLowerCase().includes(query) ||
        (doctor.speciality || "").toLowerCase().includes(query) ||
        (appointment.slotDate || "").toLowerCase().includes(query) ||
        (appointment.slotTime || "").toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [appointments, activeFilter, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      upcoming: appointments.filter(
        (item) => getAppointmentStatus(item) === "Upcoming",
      ).length,
      completed: appointments.filter(
        (item) => getAppointmentStatus(item) === "Completed",
      ).length,
      cancelled: appointments.filter(
        (item) => getAppointmentStatus(item) === "Cancelled",
      ).length,
    };
  }, [appointments]);

  const closeModal = () => {
    if (!actionLoading) setModal(null);
  };
  const openCancelModal = (appointment) => {
    setModal({
      type: "cancel",
      appointment,
      title: "Cancel appointment?",
      description:
        "Are you sure you want to cancel this appointment? This action cannot be undone.",
      confirmText: "Yes, Cancel",
      cancelText: "Keep Appointment",
    });
  };

  const handleCancelAppointment = async () => {
    if (!modal?.appointment?._id) return;

    setActionLoading(true);

    try {
      const result = await dispatch(
        cancelAppointment(modal.appointment._id),
      ).unwrap();

      toast.success(result.message || "Appointment cancelled successfully");

      setModal(null);
      dispatch(resetUserSuccessStates());
      await dispatch(listAppointment()).unwrap();
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to cancel appointment",
      );
    } finally {
      setActionLoading(false);
    }
  };
  const handleReschedule = (appointment) => {
    const doctorId = getDoctorId(appointment);

    if (!doctorId) {
      toast.error("Doctor details are unavailable");
      return;
    }

    navigate(`/appointment/${doctorId}`, {
      state: { appointment },
    });
  };


  const openOfflineModal = (appointment) => {
    setModal({
      type: "offline",
      appointment,
      title: "Request offline payment",
      description:
        "Send a request to pay at the hospital. Your payment status will remain pending until the hospital/admin confirms the payment.",
      confirmText: "Send Request",
      cancelText: "Not Now",
    });
  };

  const handleOfflinePayment = async () => {
    if (!modal?.appointment?._id) return;

    setActionLoading(true);

    try {
      const result = await dispatch(
        requestOfflinePayment(modal.appointment._id),
      ).unwrap();

      toast.success(result.message || "Offline payment request sent");

      setModal(null);
      dispatch(resetUserSuccessStates());
      await dispatch(listAppointment()).unwrap();
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to request offline payment",
      );
    } finally {
      setActionLoading(false);
    }
  };


  useEffect(()=>{
    window.scrollTo(0,0);
  },[])

  const handleRazorpayPayment = async (appointment) => {
    setActionLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay could not be loaded. Please try again.");
      }
      const result = await dispatch(
        createRazorpayOrder(appointment._id),
      ).unwrap();

      if (!result?.order) {
        throw new Error("Unable to create payment order");
      }

      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!key) {
        throw new Error(
          "Razorpay key is missing. Please configure VITE_RAZORPAY_KEY_ID.",
        );
      }

      setModal(null);
      setActionLoading(false);

      const razorpay = new window.Razorpay({
        key,
        amount: result.order.amount,
        currency: result.order.currency || "INR",
        name: "Prescriptio Appointment",
        description: `Appointment with ${
          getDoctor(appointment).name || "Doctor"
        }`,
        order_id: result.order.id,

        handler: async (response) => {
          setActionLoading(true);

          try {
            const verification = await dispatch(
              verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            ).unwrap();

            toast.success(verification.message || "Payment successful");

            dispatch(resetUserSuccessStates());
            await dispatch(listAppointment()).unwrap();
          } catch (error) {
            toast.error(
              typeof error === "string" ? error : "Payment verification failed",
            );
          } finally {
            setActionLoading(false);
          }
        },

        prefill: {
          name: appointment.userData?.name || "",
          email: appointment.userData?.email || "",
          contact: appointment.userData?.phone || "",
        },

        theme: {
          color: "#4f46e5",
        },

        modal: {
          ondismiss: () => {
            toast("Payment window closed");
          },
        },
      });

      razorpay.on("payment.failed", (response) => {
        toast.error(response.error?.description || "Payment failed");
      });

      razorpay.open();
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error.message || "Unable to start Razorpay payment",
      );

      setActionLoading(false);
    }
  };

  const handleStripePayment = async (appointment) => {
    setActionLoading(true);
    try {
      const result = await dispatch(
        createStripeCheckoutSession(appointment._id),
      ).unwrap();
      if (!result?.url) {
        throw new Error("Stripe checkout URL is missing");
      }
      window.location.href = result.url;
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error.message || "Unable to start Stripe payment",
      );

      setActionLoading(false);
    }
  };

  const openPaymentModal = (appointment) => {
    setModal({
      type: "payment",
      appointment,
      title: "Choose payment method",
      description: "Select how you would like to pay for your appointment.",
    });
  };

  const handlePaymentChoice = (method) => {
    const appointment = modal?.appointment;

    if (!appointment) return;

    setModal(null);

    if (method === "razorpay") {
      handleRazorpayPayment(appointment);
    } else {
      handleStripePayment(appointment);
    }
  };

  const confirmModalAction = () => {
    if (modal?.type === "cancel") {
      handleCancelAppointment();
    } else if (modal?.type === "offline") {
      handleOfflinePayment();
    }
  };

  if (appointmentsLoading && appointments.length === 0) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <Loader2 size={30} className="animate-spin" />
          </div>

          <h2 className="mt-5 text-xl font-extrabold text-slate-900">
            Loading your appointments
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please wait while we fetch your appointment details.
          </p>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900" />

        <div className="absolute -right-20 -top-36 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-indigo-200">
                <HeartPulse size={15} />
                Patient Dashboard
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                My Appointments
                <span className="mt-1 block bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                  Your health, your priority.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Manage your doctor visits, keep track of payments, and stay up
                to date with your healthcare journey.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/doctors")}
              className="inline-flex w-fit items-center justify-center cursor-pointer gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-indigo-50"
            >
              <Stethoscope size={18} />
              Find a Doctor
              <ArrowRight size={16} />
            </button>
          </div>

          {/* STATS */}

          <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
            {[
              {
                label: "Total Appointments",
                value: stats.total,
                icon: CalendarDays,
                color: "bg-indigo-500/15 text-indigo-300",
              },
              {
                label: "Upcoming Visits",
                value: stats.upcoming,
                icon: Clock3,
                color: "bg-blue-500/15 text-blue-300",
              },
              {
                label: "Completed Visits",
                value: stats.completed,
                icon: CheckCircle2,
                color: "bg-emerald-500/15 text-emerald-300",
              },
              {
                label: "Cancelled Visits",
                value: stats.cancelled,
                icon: XCircle,
                color: "bg-red-500/15 text-red-300",
              },
            ].map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm sm:p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium leading-5 text-slate-300 sm:text-sm">
                      {stat.label}
                    </p>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
                    >
                      <Icon size={18} />
                    </span>
                  </div>

                  <p className="mt-4 text-3xl font-extrabold text-white">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* SECTION HEADING */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Your healthcare
            </p>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Appointment History
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              View, manage and track all your doctor appointments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => dispatch(listAppointment())}
            disabled={appointmentsLoading}
            className="inline-flex w-fit items-center justify-center cursor-pointer gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={appointmentsLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* SEARCH AND FILTER */}

        <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search doctor, speciality or date..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter size={17} className="mr-1 shrink-0 text-slate-400" />

              {["All", "Upcoming", "Completed", "Cancelled"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition cursor-pointer ${
                    activeFilter === filter
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* API ERROR */}

        {appointmentsError && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <XCircle size={20} className="mt-0.5 shrink-0 text-red-600" />

              <div>
                <p className="font-bold text-red-800">
                  Unable to load appointments
                </p>

                <p className="mt-1 text-sm text-red-700">{appointmentsError}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => dispatch(listAppointment())}
              className="inline-flex items-center justify-center cursor-pointer gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
            >
              <RefreshCw size={15} /> 
              Try Again
            </button>
          </div>
        )}

        {/* APPOINTMENT LIST */}

        <div className="mt-6 space-y-5">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                onCancel={openCancelModal}
                onReschedule={handleReschedule}
                onPay={openPaymentModal}
                onOfflinePayment={openOfflineModal}
                actionLoading={actionLoading || paymentLoading}
              />
            ))
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm sm:py-20">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
                {searchTerm || activeFilter !== "All" ? (
                  <Search size={32} />
                ) : (
                  <CalendarDays size={34} />
                )}
              </div>

              <h3 className="mt-6 text-xl font-extrabold text-slate-900">
                {searchTerm || activeFilter !== "All"
                  ? "No matching appointments"
                  : "No appointments yet"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {searchTerm || activeFilter !== "All"
                  ? "Try changing your search or selecting another filter."
                  : "Your appointments will appear here after you book a consultation with a doctor."}
              </p>

              {searchTerm || activeFilter !== "All" ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveFilter("All");
                  }}
                  className="mt-6 rounded-xl border border-slate-200 cursor-pointer px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/doctors")}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 cursor-pointer px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  Explore Doctors
                  <ChevronRight size={17} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* FOOTNOTE */}

        {appointments.length > 0 && (
          <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={21} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">
                Your healthcare information
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Appointment and payment information is displayed according to
                the details returned by your account.
              </p>
            </div>

            <div className="sm:ml-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
                <FileText size={14} />
                {filteredAppointments.length} shown
              </span>
            </div>
          </div>
        )}
      </section>

      {/* CONFIRMATION MODAL */}

      {modal && modal.type !== "payment" && (
        <ConfirmModal
          modal={modal}
          onClose={closeModal}
          onConfirm={confirmModalAction}
          loading={actionLoading}
        />
      )}

      {/* PAYMENT METHOD MODAL */}

      {modal?.type === "payment" && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-2xl">
            <div className="relative bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 pb-5">
              <button
                type="button"
                onClick={closeModal}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border cursor-pointer border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
                aria-label="Close payment options"
              >
                <X size={18} />
              </button>

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <CreditCard size={27} />
              </div>

              <h2 className="pr-8 text-2xl font-extrabold text-slate-900">
                Choose payment
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Select a payment provider to pay for your consultation.
              </p>
            </div>

            <div className="px-6 pb-6">
              <div className="mb-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Total payable
                  </p>

                  <p className="mt-1 text-2xl font-extrabold text-slate-900">
                    ₹{modal.appointment?.amount ?? 0}
                  </p>
                </div>

                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                  <ShieldCheck size={22} />
                </span>
              </div>

              <button
                type="button"
                onClick={() => handlePaymentChoice("razorpay")}
                disabled={actionLoading || paymentLoading}
                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left cursor-pointer transition hover:border-indigo-300 hover:bg-indigo-50/50 disabled:opacity-50"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <CreditCard size={23} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-extrabold text-slate-900">
                    Razorpay
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Pay using available cards, UPI or other supported methods.
                  </span>
                </span>

                <ChevronRight
                  size={19}
                  className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                />
              </button>

              <button
                type="button"
                onClick={() => handlePaymentChoice("stripe")}
                disabled={actionLoading || paymentLoading}
                className="group mt-3 flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition cursor-pointer hover:border-violet-300 hover:bg-violet-50/50 disabled:opacity-50"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <Wallet size={23} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-extrabold text-slate-900">
                    Stripe
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Continue to Stripe's secure checkout page.
                  </span>
                </span>

                <ChevronRight
                  size={19}
                  className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet-600"
                />
              </button>

              <button
                type="button"
                onClick={closeModal}
                className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
export default Myappointment;
