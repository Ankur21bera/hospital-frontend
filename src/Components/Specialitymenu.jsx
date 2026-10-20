import { ArrowRight, HeartPulse, ShieldCheck, Sparkles } from 'lucide-react'
import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const Specialitymenu = () => {
  return (
    <section className='relative lg:mt-8 mt-8 isolate overflow-hidden bg-gradient-to-b from-white via-[#f5fbfc] to-white py-16 sm:py-20 lg:py-24'>
     <div className="pointer-events-none absolute -left-28 -top-24 -z-10 h-72 w-72 rounded-full bg-cyan-100/70 blur-3xl sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute -bottom-24 -right-28 -z-10 h-72 w-72 rounded-full bg-teal-100/60 blur-3xl sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-50/60 blur-3xl" />
      <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
       <div className='mx-auto max-w-3xl text-center'>
        <span className='inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white px-4 py-2 text-xs font-bold tracking-wide text-[#087f8c] shadow-sm sm:px-5 sm:text-sm'>
          <HeartPulse size={17}/>
          PERSONALIZED HEALTHCARE
        </span>
        <h2 className='mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:mt-6 sm:text-4xl md:text-5xl'>
          Find The Right
          <span className='mt-2 block text-[#087f8c] sm:inline'>
            {" "}Medical Specialist
          </span>
        </h2>
        <p className='mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:mt-6 sm:text-base sm:leading-8 sm:text-lg'>
           Connect with experienced doctors across different medical
            specialties. Explore your options and find the right
            specialist for your healthcare needs.
        </p>
        <div className='mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs font-medium text-slate-500 sm:gap-x-7 sm:text-sm'>
         <span className='inline-flex items-center gap-2'>
          <ShieldCheck size={17} className='text-teal-600'/>
          Trusted Healthcare
         </span>
         <span className='inline-flex items-center gap-2'>
          <HeartPulse size={17} className='text-teal-600'/>
          Patient-First Approach
         </span>
        </div>
       </div>
       <div className='mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6'>
        {specialityData.map((item,index)=>(
          <Link className='group relative flex min-h-[250px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-[0_16px_40px_rgba(8,127,140,0.12)] focus:outline-none focus:ring-4 focus:ring-teal-100 sm:min-h-[280px] sm:rounded-3xl sm:p-5 lg:min-h-[295px] lg:p-6' key={item.speciality|| index} to={`/doctors/${encodeURIComponent(item.speciality)}`} onClick={()=>window.scrollTo(0,0)}>
            <div className="absolute left-0 top-0 h-1 w-0 rounded-r-full bg-[#087f8c] transition-all duration-300 group-hover:w-full" />
             <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-teal-50 opacity-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100" />
             <div className='relative z-10 flex h-full flex-1 flex-col'>
              <div className='mx-auto flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-2xl border border-teal-50 bg-gradient-to-br from-[#edfafa] to-[#f1f7ff] p-4 transition-all duration-300 group-hover:border-teal-100 group-hover:shadow-md sm:h-24 sm:w-24 sm:rounded-[26px] sm:p-5'>
               <img className='w-full h-full object-contain transition-transform duration-300 group-hover:scale-110' src={item.image} alt="" />
              </div>
              <h3 className='mt-4 min-h-[44px] text-center text-sm font-bold leading-5 text-slate-800 transition-colors duration-300 group-hover:text-[#087f8c] sm:mt-5 sm:min-h-[48px] sm:text-base sm:leading-6'>
                {item.speciality}
              </h3>
              <p className='mt-2 line-clamp-3 text-center text-[11px] leading-5 text-slate-500 sm:text-xs sm:leading-6'>
                Find a doctor specializing in {item.speciality.toLowerCase()}.
              </p>
              <div className="mt-auto flex justify-center pt-4 sm:pt-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-2 text-xs font-bold text-[#087f8c] transition-all duration-300 group-hover:bg-[#087f8c] group-hover:text-white sm:gap-2 sm:px-4 sm:text-sm">
                    Explore Doctors
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
             </div>
          </Link>
        ))}
       </div>
       <div className='mt-10 sm:mt-14'>
        <div className='relative overflow-hidden rounded-2xl border border-teal-100 bg-white/90 px-5 py-6 shadow-sm sm:rounded-3xl sm:px-8 sm:py-8'>
          <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-teal-100/50 blur-2xl" />
          <div className='relative flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left'>
           <div className='flex flex-col items-center gap-3 sm:flex-row sm:gap-4'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-[#087f8c] sm:h-14 sm:w-14'>
             <Sparkles size={24}/>
            </div>
            <div>
              <h3 className='text-base font-bold text-slate-900 sm:text-lg'>Looking For A Doctor?</h3>
              <p className='mt-1 text-xs leading-5 text-slate-500 sm:text-sm'>Browse all available specialists and choose your doctor.</p>
            </div>
           </div>
           <Link className='group inline-flex min-h-[46px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#087f8c] px-5 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#066b76] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-teal-100 sm:w-auto' to="/doctors" onClick={()=>window.scrollTo(0,0)}>
           View All Doctors
           <ArrowRight size={17} className='transition-transform duration-300 group-hover:translate-x-1 lg:mt-1'/>
           </Link>
          </div>
        </div>
       </div>
      </div>
    </section>
  )
}

export default Specialitymenu