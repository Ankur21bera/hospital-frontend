import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartPulse,
  Info,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

import {
  listDoctors,
  listAppointment,
  bookAppointment,
  updateAppointment,
  getHolidays,
  resetUserSuccessStates,
} from "../Redux/Slice/userSlice";

import RelatedDoctors from "../Components/Relateddoctor";

const Appointment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { docId } = useParams();

  const {
    doctors = [],
    holidays = [],
    appointments = [],
    token,
    doctorsLoading,
    appointmentsLoading,
  } = useSelector((state) => state.user);

  const existingAppointmentFromState = location.state?.appointment || null;

  const isRescheduling = Boolean(existingAppointmentFromState);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showExistingPopup, setShowExistingPopup] = useState(false);
  const [showConflictPopup, setShowConflictPopup] = useState(false);

  const [conflictingAppointment, setConflictingAppointment] = useState(null);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-");

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDayName = (dateString) => {
    const [year, month, day] = dateString.split("-");

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
    ).toLocaleDateString("en-US", {
      weekday: "short",
    });
  };

  const currentDoctorId = String(
    existingAppointmentFromState?.docId?._id ||
      existingAppointmentFromState?.docId ||
      existingAppointmentFromState?.docData?._id ||
      docId ||
      "",
  );

  const doctor = useMemo(() => {
    return doctors.find((item) => String(item._id) === currentDoctorId);
  }, [doctors, currentDoctorId]);

  useEffect(() => {
    if (!doctors.length) {
      dispatch(listDoctors());
    }

    dispatch(getHolidays());

    if (token) {
      dispatch(listAppointment());
    }
  }, [dispatch, doctors.length, token]);

  useEffect(()=>{
    window.scrollTo(0,0);
  },[])

  const doctorAddress = useMemo(() => {
    if (!doctor?.address) {
      return "Location available on confirmation";
    }

    if (typeof doctor.address === "string") {
      return doctor.address;
    }

    return (
      [
        doctor.address?.line1,
        doctor.address?.line2,
        doctor.address?.city,
        doctor.address?.state,
      ]
        .filter(Boolean)
        .join(", ") || "Location available on confirmation"
    );
  }, [doctor]);

  const activeDoctorAppointment = useMemo(() => {
    if (!token || !doctor?._id || isRescheduling) {
      return null;
    }

    return (
      appointments.find((appointment) => {
        const appointmentDoctorId = String(
          appointment?.docId?._id ||
            appointment?.docId ||
            appointment?.docData?._id ||
            "",
        );

        return (
          appointmentDoctorId === String(doctor._id) &&
          !appointment.cancelled &&
          !appointment.isCompleted
        );
      }) || null
    );
  }, [appointments, doctor, token, isRescheduling]);

  const appointmentBeingEdited = existingAppointmentFromState || null;

  useEffect(() => {
    setSelectedTime("");
  }, [selectedDate]);

  const dateOptions = useMemo(() => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);

      date.setDate(today.getDate() + i);

      const dateString = formatDate(date);

      const holiday = holidays.find((item) => item.date === dateString);

      dates.push({
        date,
        dateString,
        dayName: getDayName(dateString),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString("en-US", {
          month: "short",
        }),
        isSunday: date.getDay() === 0,
        isHoliday: Boolean(holiday),
        holidayReason: holiday?.reason || "Holiday",
      });
    }

    return dates;
  }, [holidays]);

  useEffect(() => {
    if (!dateOptions.length) return;

    if (
      isRescheduling &&
      existingAppointmentFromState?.slotDate &&
      !selectedDate
    ) {
      const existingDate = existingAppointmentFromState.slotDate;

      const exists = dateOptions.some(
        (item) => item.dateString === existingDate,
      );

      if (exists) {
        setSelectedDate(existingDate);
        setSelectedTime(existingAppointmentFromState.slotTime || "");
        return;
      }
    }

    if (
      selectedDate &&
      dateOptions.some((item) => item.dateString === selectedDate)
    ) {
      return;
    }

    const firstAvailableDate = dateOptions.find(
      (item) => !item.isSunday && !item.isHoliday,
    );

    setSelectedDate(
      firstAvailableDate?.dateString || dateOptions[0].dateString,
    );
  }, [dateOptions, selectedDate, isRescheduling, existingAppointmentFromState]);

  const timeSlots = useMemo(() => {
    if (!doctor || !selectedDate) return [];

    const selectedDateInfo = dateOptions.find(
      (item) => item.dateString === selectedDate,
    );

    if (
      !selectedDateInfo ||
      selectedDateInfo.isSunday ||
      selectedDateInfo.isHoliday ||
      !doctor.available
    ) {
      return [];
    }

    const slots = [];
    const startHour = 10;
    const endHour = 20;
    const now = new Date();

    const bookedSlots = doctor.slots_booked?.[selectedDate] || [];

    for (let hour = startHour; hour < endHour; hour++) {
      for (const minute of [0, 30]) {
        const slotDateTime = new Date(selectedDateInfo.date);

        slotDateTime.setHours(hour, minute, 0, 0);

        if (selectedDate === formatDate(now) && slotDateTime <= now) {
          continue;
        }

        const time = slotDateTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        const isCurrentEditingSlot =
          isRescheduling &&
          appointmentBeingEdited?.slotDate === selectedDate &&
          appointmentBeingEdited?.slotTime === time;

        if (bookedSlots.includes(time) && !isCurrentEditingSlot) {
          continue;
        }

        slots.push(time);
      }
    }

    return slots;
  }, [
    doctor,
    selectedDate,
    dateOptions,
    isRescheduling,
    appointmentBeingEdited,
  ]);

  const selectedDateInfo = dateOptions.find(
    (item) => item.dateString === selectedDate,
  );

  const isSelectedHoliday = selectedDateInfo?.isHoliday || false;

  const isSelectedSunday = selectedDateInfo?.isSunday || false;

  const findAppointmentConflict = () => {
    if (!token || !doctor || !selectedDate || !selectedTime) {
      return null;
    }

    return (
      appointments.find((appointment) => {
        const appointmentDoctorId = String(
          appointment?.docId?._id ||
            appointment?.docId ||
            appointment?.docData?._id ||
            "",
        );

        const sameAppointment =
          appointmentBeingEdited?._id &&
          String(appointment._id) === String(appointmentBeingEdited._id);

        return (
          !sameAppointment &&
          appointmentDoctorId === String(doctor._id) &&
          appointment.slotDate === selectedDate &&
          appointment.slotTime === selectedTime &&
          !appointment.cancelled &&
          !appointment.isCompleted
        );
      }) || null
    );
  };

  const handleBookingClick = () => {
    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    if (!doctor) {
      toast.error("Doctor details are not available.");
      return;
    }

    if (!doctor.available) {
      toast.error("This doctor is currently unavailable.");
      return;
    }

    if (isSelectedHoliday || isSelectedSunday) {
      toast.error("Please select another appointment date.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time slot.");
      return;
    }

    const conflict = findAppointmentConflict();

    if (conflict) {
      setConflictingAppointment(conflict);
      setShowConflictPopup(true);
      return;
    }

    if (!isRescheduling && activeDoctorAppointment) {
      setShowExistingPopup(true);
      return;
    }

    setShowConfirmPopup(true);
  };

  const handleRescheduleExisting = () => {
    if (!activeDoctorAppointment) return;

    setShowExistingPopup(false);

    navigate(
      `/appointment/${
        activeDoctorAppointment.docId?._id ||
        activeDoctorAppointment.docId ||
        activeDoctorAppointment.docData?._id
      }`,
      {
        state: {
          appointment: activeDoctorAppointment,
        },
      },
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleConfirmBooking = async () => {
    if (!token) {
      setShowConfirmPopup(false);
      setShowLoginPopup(true);
      return;
    }

    if (!doctor || !selectedDate || !selectedTime) {
      toast.error("Please select a valid date and time.");
      return;
    }

    const conflict = findAppointmentConflict();

    if (conflict) {
      setShowConfirmPopup(false);
      setConflictingAppointment(conflict);
      setShowConflictPopup(true);
      return;
    }

    try {
      if (isRescheduling) {
        await dispatch(
          updateAppointment({
            appointmentId: existingAppointmentFromState._id,
            slotDate: selectedDate,
            slotTime: selectedTime,
          }),
        ).unwrap();

        toast.success("Appointment rescheduled successfully!");
      } else {
        await dispatch(
          bookAppointment({
            docId: doctor._id,
            slotDate: selectedDate,
            slotTime: selectedTime,
          }),
        ).unwrap();

        toast.success("Appointment booked successfully!");
      }

      setShowConfirmPopup(false);

      dispatch(resetUserSuccessStates());

      navigate("/my-appointments");
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message ||
              "Unable to process your appointment. Please try again.",
      );
    }
  };

  const handleLoginNavigation = () => {
    setShowLoginPopup(false);

    navigate("/login", {
      state: {
        from: location.pathname,
      },
    });
  };

  if (doctorsLoading && !doctor) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4 py-10">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-slate-200/60">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-indigo-50 ring-8 ring-indigo-50/60">
            <LoaderCircle size={31} className="animate-spin text-indigo-600" />
          </div>

          <h2 className="mt-6 text-xl font-black tracking-tight text-slate-900">
            Preparing your appointment
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Please wait while we load the doctor and appointment details.
          </p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4 py-10">
        <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-slate-200/60">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-indigo-50 ring-8 ring-indigo-50/50">
            <Stethoscope size={38} className="text-indigo-600" />
          </div>

          <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-900">
            Doctor Not Found
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            We couldn't find this doctor's information. Please return to the
            doctors list and try again.
          </p>

          <button
            type="button"
            onClick={() => navigate("/doctors")}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-slate-300 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            <ArrowLeft size={18} />
            Explore Doctors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f9fc] pb-16">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-900" />

        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-11 lg:px-8 lg:py-12">
          <button
            type="button"
            onClick={() => navigate("/doctors")}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 text-xs font-bold text-white shadow-lg backdrop-blur-xl transition hover:bg-white/15"
          >
            <ArrowLeft size={16} />
            Back to Doctors
          </button>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-3.5 py-2 text-[10px] font-black tracking-[0.14em] text-indigo-100 backdrop-blur-xl sm:text-xs">
                <HeartPulse size={14} />
                YOUR HEALTH, OUR PRIORITY
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                {isRescheduling
                  ? "Reschedule your appointment"
                  : "Book your appointment"}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-indigo-100/75 sm:text-base">
                Choose a convenient date and time to connect with your doctor.
                Your care journey starts here.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-xl">
                  <ShieldCheck size={14} />
                  Secure booking
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-xl">
                  <CalendarDays size={14} />
                  Flexible scheduling
                </span>
              </div>
            </div>

            <div className="hidden h-36 w-36 shrink-0 items-center justify-center rounded-[2rem] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl lg:flex">
              <Stethoscope size={65} strokeWidth={1.1} className="text-white" />
            </div>
          </div>
        </div>
      </section>
      <section className="relative mx-auto -mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-7">
            {/* EXISTING APPOINTMENT */}
            {activeDoctorAppointment && (
              <div className="overflow-hidden rounded-[2rem] border border-indigo-100 bg-white shadow-xl shadow-indigo-100/40">
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400" />
                <div className="p-5 sm:p-7">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50">
                        <Info size={22} className="text-indigo-600" />
                      </div>

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-500">
                          Existing appointment
                        </p>

                        <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900">
                          You already have an appointment
                        </h2>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                          You already have an active appointment with this
                          doctor. You can reschedule it instead of creating
                          another booking.
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                      <CheckCircle2 size={14} />
                      Active
                    </span>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                          <CalendarDays size={18} className="text-indigo-600" />
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">Current date</p>

                          <p className="mt-0.5 font-bold text-slate-900">
                            {formatDisplayDate(
                              activeDoctorAppointment.slotDate,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                          <Clock3 size={18} className="text-violet-600" />
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">Current time</p>

                          <p className="mt-0.5 font-bold text-slate-900">
                            {activeDoctorAppointment.slotTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRescheduleExisting}
                    className="mt-5 inline-flex w-full items-center justify-center cursor-pointer gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 sm:w-auto"
                  >
                    <CalendarDays size={18} />
                    Reschedule This Appointment
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            )}

            {/* DOCTOR */}

            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
              <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400" />

              <div className="p-5 sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50">
                    <UserRound size={21} className="text-indigo-600" />
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Your Specialist
                    </h2>

                    <p className="text-sm text-slate-500">Doctor information</p>
                  </div>
                </div>

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="h-48 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 sm:h-36 sm:w-36">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-black text-slate-900 sm:text-2xl">
                        {doctor.name}
                      </h3>

                      {doctor.available ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Available
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-black text-red-600">
                          Unavailable
                        </span>
                      )}
                    </div>

                    <p className="mt-1.5 font-bold text-indigo-600">
                      {doctor.speciality}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      {doctor.degree}
                      {doctor.experience
                        ? ` · ${doctor.experience} experience`
                        : ""}
                    </p>

                    <div className="mt-4 flex items-start gap-2 text-sm text-slate-500">
                      <MapPin
                        size={17}
                        className="mt-0.5 shrink-0 text-indigo-500"
                      />

                      <span className="leading-6">{doctorAddress}</span>
                    </div>
                  </div>
                </div>

                {doctor.about && (
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      About the doctor
                    </p>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {doctor.about}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* DATE */}

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/30 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50">
                  <CalendarDays size={21} className="text-indigo-600" />
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Select a Date
                  </h2>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Choose your preferred appointment day
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
                {dateOptions.map((item) => {
                  const isSelected = selectedDate === item.dateString;
                  const isDisabled = item.isSunday || item.isHoliday;

                  return (
                    <button
                      key={item.dateString}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => setSelectedDate(item.dateString)}
                      className={`relative min-h-[118px] overflow-hidden cursor-pointer rounded-2xl border p-3 text-center transition-all duration-200 ${
                        isDisabled
                          ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                          : isSelected
                            ? "border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-200"
                            : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-md"
                      }`}
                    >
                      <p className="text-[10px] font-black uppercase tracking-wider">
                        {item.dayName}
                      </p>

                      <p className="mt-2 text-2xl font-black">
                        {item.dayNumber}
                      </p>

                      <p className="mt-1 text-xs font-bold">{item.month}</p>

                      {item.isHoliday && (
                        <span className="mt-1 block text-[10px] font-black text-red-500">
                          Holiday
                        </span>
                      )}

                      {item.isSunday && !item.isHoliday && (
                        <span className="mt-1 block text-[10px] font-black">
                          Closed
                        </span>
                      )}

                      {isSelected && !isDisabled && (
                        <CheckCircle2
                          size={15}
                          className="absolute right-2 top-2"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {isSelectedHoliday && (
                <div className="mt-5 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
                  <CalendarDays
                    size={20}
                    className="mt-0.5 shrink-0 text-red-500"
                  />

                  <div>
                    <p className="font-bold text-red-700">
                      Appointments are closed
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                      {selectedDateInfo?.holidayReason}
                    </p>
                  </div>
                </div>
              )}

              {isSelectedSunday && !isSelectedHoliday && (
                <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-medium leading-6 text-amber-800">
                  Sunday is not available for appointments. Please select
                  another date.
                </div>
              )}
            </div>

            {/* TIME */}

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/30 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50">
                  <Clock3 size={21} className="text-violet-600" />
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Select a Time
                  </h2>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Available slots for {formatDisplayDate(selectedDate)}
                  </p>
                </div>
              </div>

              {!doctor.available ? (
                <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
                  <p className="font-bold text-red-700">
                    Doctor currently unavailable
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    Please choose another doctor.
                  </p>
                </div>
              ) : isSelectedHoliday || isSelectedSunday ? (
                <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                  No time slots are available on this date.
                </div>
              ) : timeSlots.length > 0 ? (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {timeSlots.map((time) => {
                    const isSelected = selectedTime === time;

                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`flex items-center cursor-pointer justify-center gap-2 rounded-xl border px-3 py-3.5 text-sm font-bold transition-all ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                            : "border-slate-200 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700"
                        }`}
                      >
                        <Clock3 size={15} />
                        {time}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-6 text-center">
                  <Clock3 size={25} className="mx-auto text-amber-600" />

                  <p className="mt-2 font-bold text-amber-800">
                    No slots available
                  </p>

                  <p className="mt-1 text-sm text-amber-700">
                    Please select another date.
                  </p>
                </div>
              )}
            </div>
          </div>
          <aside className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/50">
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 p-6 text-white">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xl">
                  <CalendarDays size={24} />
                </div>

                <p className="relative mt-5 text-sm font-bold text-indigo-100">
                  {isRescheduling ? "Update your schedule" : "Your appointment"}
                </p>

                <h2 className="relative mt-1 text-2xl font-black tracking-tight">
                  {isRescheduling ? "Reschedule Booking" : "Booking Summary"}
                </h2>

                <p className="relative mt-2 text-sm leading-6 text-indigo-100/90">
                  Review your appointment details before confirming.
                </p>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Doctor
                  </p>

                  <p className="mt-1 font-black text-slate-900">
                    {doctor.name}
                  </p>

                  <p className="mt-1 text-sm font-bold text-indigo-600">
                    {doctor.speciality}
                  </p>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                    <CalendarDays size={18} className="text-indigo-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">
                      Appointment Date
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {selectedDate
                        ? formatDisplayDate(selectedDate)
                        : "Select a date"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                    <Clock3 size={18} className="text-violet-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">
                      Appointment Time
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {selectedTime || "Select a time slot"}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Wallet size={17} />
                    Consultation Fee
                  </div>

                  <p className="text-xl font-black text-slate-900">
                    ₹{doctor.fees}
                  </p>
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
                  <div className="flex items-start gap-2">
                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-indigo-600"
                    />

                    <div>
                      <p className="text-sm font-bold text-indigo-900">
                        Secure appointment
                      </p>

                      <p className="mt-1 text-xs leading-5 text-indigo-700">
                        Your appointment details will be saved securely to your
                        account.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBookingClick}
                  disabled={
                    appointmentsLoading ||
                    !doctor.available ||
                    !selectedDate ||
                    !selectedTime ||
                    isSelectedHoliday ||
                    isSelectedSunday
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 cursor-pointer px-5 py-4 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  {appointmentsLoading ? (
                    <>
                      <LoaderCircle size={19} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {isRescheduling
                        ? "Update Appointment"
                        : "Book Appointment"}

                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] leading-5 text-slate-400">
                  By continuing, you confirm that the selected appointment
                  details are correct.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
      <div className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
        <RelatedDoctors
          doctors={doctors}
          currentDoctorId={doctor._id}
          speciality={doctor.speciality}
        />
      </div>
      {showLoginPopup && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md"
          onClick={() => setShowLoginPopup(false)}
        >
          <div className="flex min-h-full items-center justify-center">
            <div
              role="dialog"
              aria-modal="true"
              onClick={(event) => event.stopPropagation()}
              className="my-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.45)]"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-700 px-6 pb-8 pt-8 text-center text-white sm:px-8">
                <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-indigo-400/20 blur-3xl" />

                <button
                  type="button"
                  onClick={() => setShowLoginPopup(false)}
                  className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                >
                  <X size={19} />
                </button>

                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-xl">
                  <LockKeyhole size={29} />
                </div>

                <h2 className="relative mt-5 text-2xl font-black tracking-tight">
                  Login Required
                </h2>

                <p className="relative mx-auto mt-2 max-w-xs text-sm leading-6 text-indigo-100">
                  Please log in to your account to book or manage your doctor
                  appointment.
                </p>
              </div>

              <div className="p-5 sm:p-7">
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={20}
                      className="mt-0.5 shrink-0 text-indigo-600"
                    />

                    <div>
                      <p className="font-bold text-slate-900">
                        Your appointment is secure
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Login allows you to book, reschedule and manage your
                        appointments securely.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLoginNavigation}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-black cursor-pointer text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                >
                  Login to Continue
                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => setShowLoginPopup(false)}
                  className="mt-3 w-full rounded-2xl border border-slate-200 py-3.5 text-sm font-bold text-slate-600 cursor-pointer transition hover:bg-slate-50"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExistingPopup && activeDoctorAppointment && (
        <div
          className="fixed inset-0 z-[110] overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md"
          onClick={() => setShowExistingPopup(false)}
        >
          <div className="flex min-h-full items-center justify-center">
            <div
              role="dialog"
              aria-modal="true"
              onClick={(event) => event.stopPropagation()}
              className="my-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.45)]"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 p-6 text-white sm:p-7">
                <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

                <button
                  type="button"
                  onClick={() => setShowExistingPopup(false)}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full cursor-pointer bg-white/10 transition hover:bg-white/20"
                >
                  <X size={18} />
                </button>

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xl">
                  <CalendarDays size={27} />
                </div>

                <p className="relative mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-100">
                  Existing booking
                </p>

                <h2 className="relative mt-1 text-2xl font-black tracking-tight">
                  You already have an appointment
                </h2>

                <p className="relative mt-2 text-sm leading-6 text-indigo-100">
                  You already have an active appointment with {doctor.name}.
                </p>
              </div>

              <div className="space-y-5 p-5 sm:p-7">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="h-16 w-16 shrink-0 rounded-2xl object-cover shadow-sm"
                    />

                    <div className="min-w-0">
                      <h3 className="truncate font-black text-slate-900">
                        {doctor.name}
                      </h3>

                      <p className="mt-1 text-sm font-bold text-indigo-600">
                        {doctor.speciality}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <CalendarDays size={18} className="text-indigo-600" />

                    <p className="mt-3 text-xs text-slate-400">Date</p>

                    <p className="mt-1 text-sm font-black text-slate-900">
                      {formatDisplayDate(activeDoctorAppointment.slotDate)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <Clock3 size={18} className="text-violet-600" />

                    <p className="mt-3 text-xs text-slate-400">Time</p>

                    <p className="mt-1 text-sm font-black text-slate-900">
                      {activeDoctorAppointment.slotTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                  <Info size={19} className="mt-0.5 shrink-0 text-indigo-600" />

                  <p className="text-sm leading-6 text-indigo-800">
                    You can keep your current appointment or choose a new date
                    and time by rescheduling it.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRescheduleExisting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 cursor-pointer py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                >
                  <CalendarDays size={18} />
                  Reschedule Appointment
                  <ArrowRight size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => setShowExistingPopup(false)}
                  className="w-full rounded-2xl border border-slate-200 cursor-pointer py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Keep Current Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConflictPopup && (
        <div
          className="fixed inset-0 z-[120] overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md"
          onClick={() => setShowConflictPopup(false)}
        >
          <div className="flex min-h-full items-center justify-center">
            <div
              role="dialog"
              aria-modal="true"
              onClick={(event) => event.stopPropagation()}
              className="my-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.45)]"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-6 text-white sm:p-7">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

                <button
                  type="button"
                  onClick={() => setShowConflictPopup(false)}
                  className="absolute right-4 cursor-pointer top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                >
                  <X size={18} />
                </button>

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xl">
                  <Info size={27} />
                </div>

                <p className="relative mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-orange-100">
                  Appointment already booked
                </p>

                <h2 className="relative mt-1 text-2xl font-black tracking-tight">
                  You already have this appointment
                </h2>

                <p className="relative mt-2 text-sm leading-6 text-orange-50">
                  The selected date and time are already associated with your
                  appointment.
                </p>
              </div>

              <div className="space-y-5 p-5 sm:p-7">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                    />

                    <div className="min-w-0">
                      <h3 className="truncate font-black text-slate-900">
                        {doctor.name}
                      </h3>

                      <p className="mt-1 text-sm font-bold text-indigo-600">
                        {doctor.speciality}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-100 bg-white p-4">
                    <CalendarDays size={18} className="text-indigo-600" />

                    <p className="mt-3 text-xs text-slate-400">Selected date</p>

                    <p className="mt-1 text-sm font-black text-slate-900">
                      {formatDisplayDate(selectedDate)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-4">
                    <Clock3 size={18} className="text-violet-600" />

                    <p className="mt-3 text-xs text-slate-400">Selected time</p>

                    <p className="mt-1 text-sm font-black text-slate-900">
                      {selectedTime}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-sm leading-6 text-amber-800">
                    You cannot create another active appointment for the same
                    doctor at the same date and time.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowConflictPopup(false)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-950 py-3.5 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  Choose Another Slot
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showConfirmPopup && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md"
          onClick={() => !appointmentsLoading && setShowConfirmPopup(false)}
        >
          <div className="flex min-h-full items-center justify-center">
            <div
              role="dialog"
              aria-modal="true"
              onClick={(event) => event.stopPropagation()}
              className="my-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.45)]"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white sm:p-7">
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider">
                      <ShieldCheck size={14} />
                      Secure confirmation
                    </div>
                    <h2 className="mt-4 text-xl font-black tracking-tight sm:text-2xl">
                      {isRescheduling
                        ? "Update Appointment?"
                        : "Confirm Appointment"}
                    </h2>
                    <p className="mt-1 text-sm text-indigo-100">
                      Please review your appointment details.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPopup(false)}
                    disabled={appointmentsLoading}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full cursor-pointer bg-white/10 transition hover:bg-white/20 disabled:opacity-50"
                  >
                    <X size={19} />
                  </button>
                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-16 w-16 shrink-0 rounded-2xl object-cover shadow-sm"
                  />

                  <div className="min-w-0">
                    <h3 className="truncate font-black text-slate-900">
                      {doctor.name}
                    </h3>

                    <p className="mt-1 text-sm font-bold text-indigo-600">
                      {doctor.speciality}
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-700">
                      ₹{doctor.fees}
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
                        <CalendarDays size={17} className="text-indigo-600" />
                      </div>

                      <span className="text-sm text-slate-500">Date</span>
                    </div>

                    <span className="text-right text-sm font-black text-slate-900">
                      {formatDisplayDate(selectedDate)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50">
                        <Clock3 size={17} className="text-violet-600" />
                      </div>

                      <span className="text-sm text-slate-500">Time</span>
                    </div>

                    <span className="text-sm font-black text-slate-900">
                      {selectedTime}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                  <p className="text-sm leading-6 text-indigo-800">
                    {isRescheduling
                      ? "Your existing appointment will be updated with the new date and time."
                      : "Please verify your selected date and time before confirming your appointment."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 p-5 sm:flex-row sm:p-6">
                <button
                  type="button"
                  onClick={() => setShowConfirmPopup(false)}
                  disabled={appointmentsLoading}
                  className="flex-1 rounded-2xl border border-slate-200 cursor-pointer py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Go Back
                </button>

                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={appointmentsLoading}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {appointmentsLoading ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />

                      {isRescheduling ? "Confirm Update" : "Confirm Booking"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
