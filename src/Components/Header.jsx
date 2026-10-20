import { ArrowRight, CalendarCheck, CheckCircle2, Clock3, HeartPulse, ShieldCheck, Stethoscope, Users } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';

const Header = () => {
  const navigate = useNavigate();

  return (
    <section className='relative mx-auto mt-4 w-[94%] max-w-[1500px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#eff8ff] via-white to-[#e7f8f6] sm:mt-6 sm:w-[92%] sm:rounded-[36px] lg:w-[90%]'>
     <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute right-[35%] top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-100 to-transparent" />
    <div className='relative z-10 px-5 py-10 sm:px-8 sm:py-14 md:px-12 md:py-16 lg:px-14 lg:py-20 xl:px-20'>
     <div className='flex flex-col items-center gap-12 lg:flex-row lg:gap-10 xl:gap-16'>
      <div className='w-full text-center lg:w-[52%] lg:text-left'>
       <div className='flex justify-center lg:justify-start'>
        <div className='inline-flex items-center gap-2.5 rounded-full border border-teal-100 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-md'>
         <span className='w-7 h-7 flex items-center justify-center rounded-full bg-teal-50 text-teal-600'>
          <HeartPulse size={17}/>
         </span>
         <span className='text-xs font-bold tracking-wide text-slate-700 sm:text-sm'>
            YOUR HEALTH, OUR PRIORITY
         </span>
         <span className='w-2 h-2 rounded-full bg-emerald-500'/>
        </div>
       </div>
       <h1 className='mt-7 text-[34px] font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:mt-8 lg:text-[48px] xl:text-[60px]'>
        Expert Care.
        <span className='mt-2 block text-[#087f8c]'>
          Heathier Lives
        </span>
       </h1>
       <p className='mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 md:text-lg lg:mx-0 lg:mt-7'>
         Get the care you deserve from experienced doctors. Book
              appointments easily, explore medical specialties, and take
              the next step towards a healthier you.
       </p>
       <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start'>
        <button className='group cursor-pointer inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-2xl bg-[#087f8c] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-900/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#066b76] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-200 sm:px-8' type='button' onClick={()=>navigate("/doctors")}>
         Book An Appointment
         <ArrowRight size={18} className='transition-transform duration-300 group-hover:translate-x-1'/>
        </button>
        <button className='inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-7 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:bg-white hover:text-[#087f8c] focus:outline-none focus:ring-4 focus:ring-teal-100 sm:px-8 cursor-pointer' type='button' onClick={()=>navigate("/about")}>
          <HeartPulse size={17}/>
          About Our Hospital
        </button>
       </div>
       <div className='mt-9 grid grid-cols-1 gap-4 border-t border-slate-200/80 pt-7 text-left sm:grid-cols-3 sm:gap-3 lg:gap-5'>
        <div className='flex items-center justify-center gap-3 sm:justify-start'>
        <div className='flex w-11 h-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600'>
          <Stethoscope size={21}/>
        </div>
        <div>
          <p className='text-sm font-bold text-slate-800'>Expert Doctors</p>
          <p className='mt-0.5 text-xs text-slate-500'>Professional Care</p>
        </div>
        </div>
         <div className='flex items-center justify-center gap-3 sm:justify-start'>
        <div className='flex w-11 h-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600'>
          <CalendarCheck size={21}/>
        </div>
        <div>
          <p className='text-sm font-bold text-slate-800'>Easy Booking</p>
          <p className='mt-0.5 text-xs text-slate-500'>Simple Scheduling</p>
        </div>
        </div>
         <div className='flex items-center justify-center gap-3 sm:justify-start'>
        <div className='flex w-11 h-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600'>
          <ShieldCheck size={21}/>
        </div>
        <div>
          <p className='text-sm font-bold text-slate-800'>Patient First</p>
          <p className='mt-0.5 text-xs text-slate-500'>Care You Can Trust</p>
        </div>
        </div>
       </div>
      </div>
      <div className='relative flex w-full items-center justify-center lg:w-[48%]'>
       <div className='absolute w-[270px] h-[270px] rounded-full bg-teal-200/40 blur-3xl sm:h-[380px] sm:w-[380px] lg:h-[440px] lg:w-[440px]'/>
       <div className='relative w-full max-w-[500px]'>
        <div className="absolute -right-3 top-8 h-24 w-24 rounded-full border-[14px] border-teal-200/50 sm:-right-5 sm:h-32 sm:w-32" />
        <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full border border-blue-200 sm:-bottom-6 sm:-left-6 sm:h-32 sm:w-32" />
         <div className='relative overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-br from-[#dff5f4] to-[#e8f1ff] p-3 shadow-2xl shadow-slate-900/10 sm:rounded-[36px] sm:p-4'>
           <img className='relative z-10 mx-auto h-auto max-h-[520px] w-full rounded-[22px] object-contain transition-transform duration-500 hover:scale-[1.02] sm:rounded-[28px]' src={assets.header_img} alt="" />
           <div className='absolute bottom-3 left-3 right-3 z-20 rounded-2xl border border-white/70 bg-white/90 p-3 shadow-lg backdrop-blur-xl sm:bottom-5 sm:left-5 sm:right-5 sm:p-4'>
            <div className='flex items-center gap-3'>
             <div className='flex w-11 h-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700'>
               <HeartPulse size={23}/>
             </div>
             <div className='min-w-0 flex-1'>
              <p className='text-sm font-extrabold text-slate-900 sm:text-base'>Care That Comes First</p>
              <p className='mt-1 text-xs leading-5 text-slate-500'>Your health journey starts here.</p>
             </div>
             <CheckCircle2 size={22} className='shrink-0 text-emerald-600'/>
            </div>
           </div>
         </div>
         <div className='absolute -right-1 top-5 z-30 max-w-[190px] rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl shadow-slate-900/10 backdrop-blur-xl sm:-right-5 sm:top-10 sm:max-w-[210px] sm:p-4'>
          <div className='flex items-center gap-3'>
           <div className='flex w-10 h-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600'>
            <Clock3 size={20}/>
           </div>
           <div>
            <p className='text-xs font-bold text-slate-800 sm:text-sm'>Easy Appointments</p>
            <p className='mt-1 text-[10px] text-slate-500 sm:text-xs'>Book Online Anytime</p>
           </div>
          </div>
         </div>
         <div className='absolute -left-1 top-[42%] z-30 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl shadow-slate-900/10 backdrop-blur-xl sm:-left-8 sm:p-4'>
          <div className='flex items-center gap-2.5'>
           <div className='flex w-9 h-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600'>
            <Users size={18}/>
           </div>
           <div>
            <p className='text-xs font-extrabold text-slate-800 sm:text-sm'>Patient Focused</p>
            <p className='mt-0.5 text-[10px] text-slate-500 sm:text-xs'>Care With Compassion</p>
           </div>
          </div>
         </div>
       </div>
      </div> 
     </div>
      </div>  
    </section>
  )
}

export default Header