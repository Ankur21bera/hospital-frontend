import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { listDoctors } from '../Redux/Slice/userSlice';
import { ArrowRight, ArrowUpRight, BadgeCheck, CalendarCheck, CheckCircle2, Clock3, HeartPulse, RefreshCw, ShieldCheck, Star, Stethoscope, Users } from 'lucide-react';

const Topdoctors = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAll,setShowAll] = useState(false);
  const {doctors = [],doctorsLoading,doctorsError} = useSelector((state)=>state.user);

  useEffect(()=>{
    dispatch(listDoctors());
  },[dispatch])

  const displayedDoctors = showAll ? doctors : doctors.slice(0,5);
  const handleAppointment = (doctorId) => {
    navigate(`/appointment/${doctorId}`);
    window.scrollTo({top:0,behavior:"smooth"})
  }

  // --doctors-loading--
  if(doctorsLoading){
    return (
      <section className='my-16 px-4 sm:px-6 lg:px-10'>
       <div className='mx-auto max-w-7xl'>
        <div className='mb-10 space-y-3'>
          <div className='w-32 h-5 animate-pulse rounded-full bg-slate-200'/>
          <div className='w-80 h-10 max-w-full animate-pulse rounded-xl bg-slate-200'/>
          <div className='w-[500px] h-4 max-w-full animate-pulse rounded-full bg-slate-200'/>
        </div>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
         {[1,2,3,4].map((item)=>(
          <div className='overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm' key={item}>
           <div className='h-[280px] animate-pulse bg-slate-200'/>
           <div className='space-y-4 p-6'>
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200" />
           </div>
          </div>
         ))}
        </div>
       </div>
      </section>
    )
  }

  // --doctors--error--
  if(doctorsError){
    return(
      <section className='my-16 px-4 sm:px-6 lg:px-10'>
       <div className='mx-auto max-w-2xl rounded-[28px] border border-red-100 bg-white p-10 text-center shadow-lg'>
        <div className='mx-auto mb-5 flex w-16 h-16 items-center justify-center rounded-2xl bg-red-50 text-red-500'>
         <RefreshCw size={28}/>
        </div>
        <h2 className='text-2xl font-bold text-slate-900'>Unable To Load Doctors</h2>
        <p className='mt-2 text-sm text-slate-500'>{doctorsError || "Something Went Wrong While Load The Data"}</p>
        <button className='mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800' onClick={()=>dispatch(listDoctors())}>
          <RefreshCw size={17}/>
          Try Again
        </button>
       </div>
      </section>
    )
  }

  if(!doctors.length){
    return(
      <div className='my-16 px-4 sm:px-6 lg:px-10'>
       <div className='mx-auto max-w-2xl rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-lg'>
        <div className='mx-auto mb-5 flex w-16 h-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600'>
         <Stethoscope size={30}/>
        </div>
        <h2 className='text-2xl font-bold text-slate-900'>No Doctors Available</h2>
        <p className='mt-2 text-sm text-slate-500'>Please check again later for available doctors.</p>
       </div>
      </div>
    )
  }

  return (
    <section className='relative my-20 overflow-hidden px-4 sm:px-6 lg:px-10'>
      {/* --background-decorations-- */}
      <div className="pointer-events-none absolute left-[-150px] top-20 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="pointer-events-none absolute right-[-150px] bottom-10 h-96 w-96 rounded-full bg-cyan-100/40 blur-3xl" />
      <div className='relative mx-auto max-w-7xl'>
       {/* --header-- */}
       <div className='mb-12 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between'>
        <div className='max-w-2xl'> 
         <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600'>
           <HeartPulse size={15}/>
           Trusted Healthcare
         </div>
         <h1 className='text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
          Meet Our{" "}
          <span className='text-blue-600'>Top Doctors</span>
         </h1>
         <p className='mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base'>
           Connect with experienced and trusted healthcare professionals
           and book your appointment with confidence.
         </p>
        </div>
        {/* --tursted-stats-- */}
        <div className='flex flex-wrap gap-3'>
         <div className='flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm'>
          <div className='flex w-10 h-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600'>
           <Users size={19}/>
          </div>
          <div>
            <p className='text-sm font-bold text-slate-900'>{doctors.length}+</p>
            <p className='text-xs text-slate-500'>Doctors</p>
          </div>
         </div>
         <div className='flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm'>
          <div className='flex w-10 h-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600'>
           <ShieldCheck size={19}/>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Verified</p>
            <p className="text-xs text-slate-500">Professionals</p>
          </div>
         </div>
        </div>
       </div>
       {/* --doctors-grid-- */}
       <div className='grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {displayedDoctors.map((item)=>(
          <div className='group relative overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-blue-100 hover:shadow-[0_25px_60px_rgba(15,23,42,0.12)]' key={item._id}>
            {/* --doctor-image-- */}
            <div className='relative h-[300px] overflow-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50'>
             <img className='w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 cursor-pointer' src={item.image} alt="" />
             <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-900/35 to-transparent" />
             {/* --availability-- */}
             <div className='absolute left-5 top-5'>
              <div className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold shadow-lg backdrop-blur-md ${item.available ? "border-emerald-200/70 bg-white/90 text-emerald-600":"border-slate-200/70 bg-white/90 text-slate-500"}`}>
               <span className={`w-2 h-2 rounded-full ${item.available ? "bg-emerald-500":"bg-slate-400"}`}/>
              </div>
             </div>
             <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-white/90 text-blue-600 shadow-lg backdrop-blur-md">
                  <BadgeCheck size={21} />
             </div>
             <button className='absolute bottom-5 right-5 flex h-12 w-12 translate-y-3 items-center justify-center rounded-2xl bg-white text-slate-900 opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-blue-600 hover:text-white cursor-pointer' onClick={()=>handleAppointment(item._id)}>
              <ArrowUpRight size={21}/>
             </button>
            </div>
            {/* --card-content-- */}
            <div className='p-6'>
             {/* --speciality-/- */}
             <div className='mb-3 flex items-center gap-2'>
              <div className='flex w-8 h-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
                <Stethoscope size={16}/>
              </div>
              <span className='text-xs font-bold uppercase tracking-wider text-blue-600'>
                {item.speciality}
              </span>
             </div>
             <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.degree || "Medical Specialist"}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-600">
                    <Star size={13} fill="currentColor" />
                    4.9
                  </div>
              </div>
              {/* --info-row-- */}
              <div className='mt-5 grid grid-cols-2 gap-3'>
               <div className='rounded-2xl bg-slate-50 p-3'>
                <div className='mb-1 flex items-center gap-2 text-slate-400'>
                 <Clock3 size={15}/>
                 <span className='text-[11px] font-semibold uppercase tracking-wide'>Experience</span>
                </div>
                <p className="text-sm font-bold text-slate-800">
                      {item.experience || "Experienced"}
                </p>
               </div>
               <div className='rounded-2xl bg-slate-50 p-3'>
                <div className='mb-1 flex items-center gap-2 text-slate-400'>
                 <HeartPulse size={15}/>
                 <span className='text-[11px] font-semibold uppercase tracking-wide'>Consultation</span>
                </div>
                <p className="text-sm font-bold text-slate-800">
                      ₹{item.fees || "N/A"}
                </p>
               </div>
              </div>
               <div className="my-5 h-px bg-slate-100" />
               <button
                  onClick={() => handleAppointment(item._id)}
                  disabled={!item.available}
                  className={`flex w-full items-center cursor-pointer justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-300 ${
                    item.available
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:bg-blue-600 hover:shadow-blue-600/20"
                      : "cursor-not-allowed bg-slate-100 text-slate-400"
                  }`}
                >
                  <CalendarCheck size={18} />

                  {item.available ? "Book Appointment" : "Not Available"}

                  {item.available && (
                    <ArrowRight
                      size={17}
                      className="ml-auto transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}
              </button>
            </div>
          </div>
        ))}
       </div>
        {doctors.length > 5 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
            >
              {showAll ? "Show Less" : "View All Doctors"}

              <ArrowRight
                size={17}
                className={`transition-transform duration-300 ${
                  showAll ? "rotate-180" : "group-hover:translate-x-1"
                }`}
              />
            </button>
          </div>
        )}
         <div className="relative mt-16 overflow-hidden rounded-[32px] bg-slate-900 px-6 py-10 shadow-2xl sm:px-10 lg:px-14">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-blue-400">
                <CheckCircle2 size={18} />
                <span className="text-xs font-bold uppercase tracking-[0.18em]">
                  Quality Healthcare
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Looking for a specific specialist?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Explore our complete list of doctors and find the right
                specialist for your healthcare needs.
              </p>
            </div>

            <button
              onClick={() => {
                navigate("/doctors");
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="group inline-flex shrink-0 items-center justify-center gap-3 cursor-pointer rounded-2xl bg-white px-7 py-4 text-sm font-bold text-slate-900 transition-all duration-300 hover:bg-blue-600 hover:text-white"
            >
              Explore All Doctors

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Topdoctors

