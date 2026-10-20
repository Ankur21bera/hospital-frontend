import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

const RelatedDoctors = ({
  doctors = [],
  currentDoctorId,
  speciality,
  appointments = [],
}) => {
  const navigate = useNavigate();
  const normalizeSpeciality = (value) => {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ");
  };

  const specialityGroups = {
    cardiologist: [
      "cardiologist",
      "cardiac",
      "cardiac surgeon",
      "cardiothoracic",
      "interventional cardiologist",
      "heart specialist",
      "cardiac specialist",
      "cardiology",
    ],

    neurologist: [
      "neurologist",
      "neurology",
      "neurosurgeon",
      "neuro physician",
      "neuro specialist",
      "brain specialist",
    ],

    dermatologist: [
      "dermatologist",
      "dermatology",
      "skin specialist",
      "cosmetologist",
      "trichologist",
      "aesthetic dermatologist",
    ],

    pediatrician: [
      "pediatrician",
      "pediatrics",
      "child specialist",
      "child doctor",
      "paediatrician",
      "paediatrics",
    ],

    orthopedist: [
      "orthopedist",
      "orthopedic",
      "orthopaedic",
      "orthopedic surgeon",
      "bone specialist",
      "joint specialist",
      "sports medicine",
    ],

    gynecologist: [
      "gynecologist",
      "gynaecologist",
      "gynecology",
      "gynaecology",
      "obstetrician",
      "obstetrics",
      "women specialist",
    ],

    dentist: [
      "dentist",
      "dental",
      "orthodontist",
      "oral surgeon",
      "prosthodontist",
      "endodontist",
      "periodontist",
    ],

    ophthalmologist: [
      "ophthalmologist",
      "ophthalmology",
      "eye specialist",
      "optometrist",
      "retina specialist",
      "cornea specialist",
    ],

    ent: [
      "ent",
      "ent specialist",
      "otolaryngologist",
      "ear nose throat",
      "ear nose and throat",
    ],

    psychiatrist: [
      "psychiatrist",
      "psychiatry",
      "mental health specialist",
      "behavioral health",
    ],

    psychologist: [
      "psychologist",
      "psychology",
      "clinical psychologist",
      "counselor",
      "mental health counselor",
    ],

    gastroenterologist: [
      "gastroenterologist",
      "gastroenterology",
      "digestive specialist",
      "liver specialist",
      "hepatologist",
    ],

    nephrologist: [
      "nephrologist",
      "nephrology",
      "kidney specialist",
      "renal specialist",
    ],

    pulmonologist: [
      "pulmonologist",
      "pulmonology",
      "chest specialist",
      "respiratory specialist",
      "lung specialist",
    ],

    endocrinologist: [
      "endocrinologist",
      "endocrinology",
      "diabetes specialist",
      "hormone specialist",
    ],

    urologist: [
      "urologist",
      "urology",
      "urinary specialist",
      "kidney urinary specialist",
    ],

    oncologist: [
      "oncologist",
      "oncology",
      "cancer specialist",
      "cancer doctor",
    ],

    general: [
      "general physician",
      "general medicine",
      "physician",
      "internal medicine",
      "family physician",
      "family medicine",
    ],
  };

  const getSpecialityGroup = (value) => {
    const specialityValue = normalizeSpeciality(value);
    if (!specialityValue) {
      return null;
    }
    for (const [groupName, values] of Object.entries(specialityGroups)) {
      const found = values.some((item) => {
        const normalizedItem = normalizeSpeciality(item);
        return (
          specialityValue === normalizedItem ||
          specialityValue.includes(normalizedItem) ||
          normalizedItem.includes(specialityValue)
        );
      });
      if (found) {
        return groupName;
      }
    }
    return null;
  };

  const getAddress = (address) => {
    if (!address) {
      return "Hospital / Clinic";
    }

    if (typeof address === "string") {
      return address;
    }

    return [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  };
  const getAppointmentDoctorId = (appointment) => {
    return String(
      appointment?.docId?._id ||
        appointment?.docId ||
        appointment?.docData?._id ||
        appointment?.docData?.id ||
        "",
    );
  };

  const isAppointmentActive = (appointment) => {
    if (!appointment) {
      return false;
    }

    const status = String(
      appointment?.status || appointment?.appointmentStatus || "",
    ).toLowerCase();

    if (appointment?.cancelled === true) {
      return false;
    }

    if (appointment?.isCompleted === true) {
      return false;
    }

    if (["cancelled", "canceled", "completed", "rejected"].includes(status)) {
      return false;
    }

    return true;
  };

  const relatedDoctors = useMemo(() => {
    const currentId = String(currentDoctorId || "");

    const currentSpeciality = normalizeSpeciality(speciality);

    if (!currentSpeciality) {
      return [];
    }

    const currentGroup = getSpecialityGroup(currentSpeciality);

    const otherDoctors = doctors.filter((doctor) => {
      return String(doctor?._id || "") !== currentId;
    });

    const scoredDoctors = otherDoctors.map((doctor) => {
      const doctorSpeciality = normalizeSpeciality(doctor?.speciality);

      let score = 0;

      if (doctorSpeciality === currentSpeciality) {
        score = 100;
      }

      const doctorGroup = getSpecialityGroup(doctorSpeciality);

      if (score < 100 && currentGroup && doctorGroup === currentGroup) {
        score = 80;
      }

      if (score < 80) {
        const currentWords = currentSpeciality.split(" ");

        const doctorWords = doctorSpeciality.split(" ");

        const commonWords = currentWords.filter(
          (word) => word.length > 2 && doctorWords.includes(word),
        );

        if (commonWords.length > 0) {
          score = 60;
        }
      }

      return {
        doctor,
        score,
      };
    });

    return scoredDoctors
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        const aAvailable = a.doctor?.available !== false;

        const bAvailable = b.doctor?.available !== false;

        if (aAvailable !== bAvailable) {
          return Number(bAvailable) - Number(aAvailable);
        }

        return String(a.doctor?.name || "").localeCompare(
          String(b.doctor?.name || ""),
        );
      })
      .slice(0, 4)
      .map((item) => item.doctor);
  }, [doctors, currentDoctorId, speciality]);

  const handleDoctorClick = (doctor) => {
    const doctorId = doctor?._id;

    if (!doctorId) {
      return;
    }

    const existingAppointment =
      appointments.find((appointment) => {
        return (
          isAppointmentActive(appointment) &&
          getAppointmentDoctorId(appointment) === String(doctorId)
        );
      }) || null;

    if (existingAppointment) {
      navigate(`/appointment/${doctorId}`, {
        state: {
          appointment: existingAppointment,
        },
      });
    } else {
      navigate(`/appointment/${doctorId}`);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!relatedDoctors.length) {
    return (
      <section className="relative">
        <div className="mb-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-indigo-600">
            <Stethoscope size={13} />
            Specialist Network
          </div>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Related Doctors
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Doctors related to{" "}
            <span className="font-bold text-indigo-600">
              {speciality || "this speciality"}
            </span>
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-dashed border-slate-200 bg-white px-5 py-14 text-center shadow-sm sm:px-8">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-50 blur-3xl" />

          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 ring-8 ring-indigo-50/50">
            <Stethoscope size={28} className="text-indigo-500" />
          </div>

          <h3 className="relative mt-5 text-lg font-black text-slate-900">
            No related doctors available
          </h3>

          <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            We couldn't find another doctor related to{" "}
            <span className="font-bold text-slate-700">
              {speciality || "this speciality"}
            </span>{" "}
            at the moment.
          </p>

          <div className="relative mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 ring-1 ring-slate-100">
            <CalendarDays size={14} />
            Please check again later
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="relative">
      {/* HEADER */}

      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-indigo-600">
            <Stethoscope size={13} />
            Specialist Network
          </div>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Related Doctors
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Doctors related to{" "}
            <span className="font-bold text-indigo-600">{speciality}</span> for
            your consultation.
          </p>
        </div>

        <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex">
          <ShieldCheck size={17} className="text-indigo-600" />

          <span className="text-xs font-bold text-slate-600">
            Trusted specialist network
          </span>
        </div>
      </div>

      {/* DOCTORS */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {relatedDoctors.map((doctor) => {
          const doctorId = String(doctor?._id || "");

          const existingAppointment =
            appointments.find((appointment) => {
              return (
                isAppointmentActive(appointment) &&
                getAppointmentDoctorId(appointment) === doctorId
              );
            }) || null;

          const hasAppointment = Boolean(existingAppointment);

          const isAvailable = doctor?.available !== false;

          const image =
            doctor?.image ||
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80";

          const doctorGroup = getSpecialityGroup(doctor?.speciality);

          const currentGroup = getSpecialityGroup(speciality);

          const isSameSpeciality =
            normalizeSpeciality(doctor?.speciality) ===
            normalizeSpeciality(speciality);

          const isRelatedSpeciality =
            !isSameSpeciality &&
            doctorGroup &&
            currentGroup &&
            doctorGroup === currentGroup;

          return (
            <article
              key={doctorId}
              className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-indigo-100 hover:shadow-2xl hover:shadow-slate-200/70"
            >
              {/* IMAGE */}

              <div className="relative h-60 overflow-hidden bg-slate-100">
                <img
                  src={image}
                  alt={doctor?.name || "Doctor"}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/5 to-transparent" />

                {/* AVAILABILITY */}

                <div className="absolute left-4 top-4">
                  {isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-[10px] font-black text-emerald-700 shadow-lg backdrop-blur-xl">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-[10px] font-black text-slate-500 shadow-lg backdrop-blur-xl">
                      Unavailable
                    </span>
                  )}
                </div>

                {/* BOOKED */}

                {hasAppointment && (
                  <div className="absolute right-4 top-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black text-indigo-700 shadow-lg backdrop-blur-xl">
                      <CheckCircle2 size={12} />
                      Booked
                    </span>
                  </div>
                )}

                {/* SPECIALITY */}

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1.5 text-[10px] font-black text-white shadow-lg">
                    <Stethoscope size={12} />

                    <span className="truncate">
                      {doctor?.speciality || "Specialist"}
                    </span>
                  </span>
                </div>
              </div>

              {/* CONTENT */}

              <div className="p-5">
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-black text-slate-900">
                        Dr. {doctor?.name || "Doctor"}
                      </h3>

                      <p className="mt-1 text-xs font-bold text-indigo-600">
                        {doctor?.speciality || "Medical Specialist"}
                      </p>
                    </div>

                    {doctor?.degree && (
                      <div className="shrink-0 rounded-lg bg-slate-50 px-2 py-1 text-[9px] font-black text-slate-500 ring-1 ring-slate-100">
                        {doctor.degree}
                      </div>
                    )}
                  </div>

                  {/* SPECIALITY TYPE */}

                  {(isSameSpeciality || isRelatedSpeciality) && (
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[9px] font-black text-indigo-600">
                      <CheckCircle2 size={11} />

                      {isSameSpeciality
                        ? "Same speciality"
                        : "Related speciality"}
                    </div>
                  )}

                  {/* ADDRESS */}

                  <div className="mt-4 flex items-start gap-2 text-xs text-slate-500">
                    <MapPin
                      size={14}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />

                    <span className="line-clamp-2 leading-5">
                      {getAddress(doctor?.address)}
                    </span>
                  </div>

                  {/* EXPERIENCE */}

                  {doctor?.experience && (
                    <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
                      <CheckCircle2 size={14} className="text-emerald-500" />

                      {doctor.experience}
                    </div>
                  )}

                  {/* PRICE */}

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Consultation
                      </p>

                      <p className="mt-0.5 text-base font-black text-slate-900">
                        ₹{doctor?.fees || 0}
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 transition group-hover:bg-indigo-100">
                      <CalendarDays size={16} className="text-indigo-600" />
                    </div>
                  </div>

                  {/* BUTTON */}

                  {hasAppointment ? (
                    <button
                      type="button"
                      onClick={() => handleDoctorClick(doctor)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-xs font-black text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
                    >
                      <CalendarClock size={15} />
                      Manage Appointment
                      <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => handleDoctorClick(doctor)}
                      className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-black transition ${
                        isAvailable
                          ? "bg-slate-950 text-white shadow-lg shadow-slate-200 hover:bg-indigo-600"
                          : "cursor-not-allowed bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isAvailable ? (
                        <>
                          Book Appointment
                          <ArrowRight size={14} />
                        </>
                      ) : (
                        "Currently Unavailable"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedDoctors;
