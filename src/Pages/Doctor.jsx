import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { listDoctors } from '../Redux/Slice/userSlice';
import { ArrowRight, ArrowUpRight, BadgeCheck, CalendarCheck, CheckCircle2, Clock3, Filter, HeartPulse, Search, ShieldCheck, SlidersHorizontal, Stethoscope, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Doctor = () => {
  const {speciality} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {doctors = [],doctorsLoading,doctorsError} = useSelector((state)=>state.user);
  const [searchTerm,setSearchTerm] = useState("");
  const [selectedSpeciality,setSelectedSpeciality] = useState(speciality || "All Specialities");
  const [availabilityFilter,setAvailabilityFilter] = useState("All");
  const [sortBy,setSortBy] = useState("default");
  const specialityList = ["All Specialities", "General physician", "Gynecologist", "Dermatologist", "Pediatricians", "Neurologist", "Gastroenterologist", "Cardiologist",] ;

  // --fetch--doctors--
  useEffect(()=>{
    dispatch(listDoctors());
  },[dispatch])

  useEffect(()=>{
    const decodedSpeciality = speciality ? decodeURIComponent(speciality) : "All Specialities";
    setSelectedSpeciality(decodedSpeciality);
  },[speciality])

  useEffect(()=>{
    window.scrollTo(0,0);
  },[])

  const handleSpeciality = (item) => {
    setSelectedSpeciality(item);
    setSearchTerm("");
    if(item === "All Specialities"){
      navigate("/doctors")
    } else{
      navigate(`/doctors/${encodeURIComponent(item)}`);
    }
    window.scrollTo({top:0,behavior:"smooth"})
  }

  const handleAppointment = (doctorId) => {
    if(!doctorId) return;
    navigate(`/appointment/${doctorId}`);
    window.scrollTo({top:0,behavior:"smooth"});
  }

  const filteredDoctors = useMemo(()=>{
    let result = [...doctors];
    if(selectedSpeciality !== "All Specialities"){
      result = result.filter((doctor)=>doctor.speciality?.toLowerCase() === selectedSpeciality.toLowerCase())
    }
    if(searchTerm.trim()){
      const query = searchTerm.trim().toLowerCase();
      result = result.filter((doctor)=>{
        const address = [doctor.address?.line1,doctor.address?.line2].filter(Boolean).join("").toLowerCase();
        return(
          doctor.name?.toLowerCase().includes(query) || doctor.speciality?.toLowerCase().includes(query) || doctor.degree?.toLowerCase().includes(query) ||
         String(doctor.experience|| "").toLowerCase().includes(query) || address.includes(query)
        )
      })
    }
    if(availabilityFilter === "Available"){
      result = result.filter((doctor)=>doctor.available);
    }
    if(availabilityFilter === "Unavailable"){
      result = result.filter((doctor)=>!doctor.available);
    }
    if(sortBy === "fees-low"){
      result.sort((a,b)=>Number(a.fees || 0) - Number(b.fees || 0))
    } else if(sortBy === "fees-high"){
      result.sort((a,b)=>Number(b.fees || 0) - Number(a.fees || 0))
    } else if(sortBy === "experience"){
      const getYears = (value) => Number(String(value || "").match(/\d+/)?.[0] || 0);
      result.sort((a,b)=>getYears(b.experience) - getYears(a.experience))
    }
    return result;
  },[doctors,searchTerm,selectedSpeciality,availabilityFilter,sortBy])

  const clearFilters = () => {
    setSearchTerm("");
    setAvailabilityFilter("All");
    setSortBy("default");
    handleSpeciality("All Specialities")
  }

  if(doctorsLoading && doctors.length === 0) {
    return(
      <section className='min-h-[70vh] px-4 py-12 sm:px-6 lg:px-8'>
       <div className='mx-auto max-w-7xl'>
        <div className='mb-10 space-y-4'>
         <div className="h-5 w-36 animate-pulse rounded-full bg-slate-200"/>
         <div className="h-10 w-80 max-w-full animate-pulse rounded-xl bg-slate-200"/>
         <div className="h-4 w-[480px] max-w-full animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
         {[1,2,3,4,5,6,7,8].map((item)=>(
          <div className='overflow-hidden rounded-3xl border border-slate-200 bg-white' key={item}>
           <div className="h-64 animate-pulse bg-slate-200" />
           <div className='space-y-4 p-5'>
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
            <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-12 animate-pulse rounded-xl bg-slate-200" />
           </div>
          </div>
         ))}
        </div>
       </div>
      </section>
    )
  }

  if(doctorsError && doctors.length === 0) {
    return(
      <section className='flex min-h-[65vh] items-center justify-center px-4 py-12'>
       <div className='w-full max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl sm:p-10'>
        <div className='mx-auto mb-5 flex w-16 h-16 items-center justify-center rounded-2xl bg-red-50 text-red-500'>
         <HeartPulse size={30}/>
        </div>
        <h2 className='text-2xl font-bold text-slate-900'>Unable To Load Doctors</h2>
        <p className='mt-3 text-sm leading-6 text-slate-500'>{doctorsError || "Something Went Wrong While Load Doctors"}</p>
        <button className='mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 cursor-pointer' type='button' onClick={()=>dispatch(listDoctors())}>
         Try Again
         <ArrowRight size={17}/>
        </button>
       </div>
      </section>
    )
  }

  return (
    <main className='min-h-screen bg-slate-50/70 text-slate-800'>
     {/* --hero-section-- */}
     <section className='relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50'>
      <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className='relative mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14 lg:px-8 lg:pt-16'>
       <div className='grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]'>
        <div>
          <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-blue-700 shadow-sm'>
           <ShieldCheck size={16}/>
           Trusted Healthcare Professionals
          </div>
          <h1 className='max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl xl:text-6xl'>
            Find The Right Doctor 
            <span className='mt-2 block text-blue-600'>For Your Health</span>
          </h1>
          <p className='mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base'>
            Discover experienced medical professionals, explore specialities, and book your appointment with ease. Your healthcare journey starts here.
          </p>
          <div className='mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-600'>
           <div className='flex items-center gap-2'>
            <CheckCircle2 size={18} className='text-emerald-500'/>
            Experienced Doctors
           </div>
           <div className='flex items-center gap-2'>
            <CheckCircle2 size={18} className='text-emerald-500'/>
            Easy Booking
           </div>
           <div className='flex items-center gap-2'>
            <CheckCircle2 size={18} className='text-emerald-500'/>
             Patient-Focused Care
           </div>
          </div>
        </div>
        {/* --hero-information-card-/- */}
        <div className='relative mx-auto w-full max-w-md lg:ml-auto'>
         <div className='absolute -inset-3 rounded-[34px] bg-gradient-to-br  from-blue-200/50 to-cyan-100/50 blur-xl'/>
         <div className='relative overflow-hidden rounded-[28px] border border-white bg-white p-6 shadow-[0_25px_70px_rgba(15,23,42,0.10)] sm:p-8'>
          <div className='flex items-start justify-between gap-4'>
           <div>
            <p className='text-sm font-medium text-slate-500'>Our Medical Directory</p>
            <h2 className='mt-2 text-3xl font-extrabold text-slate-900'>{doctors.length} Doctors</h2>
            <p className='mt-2 text-sm leading-6 text-slate-500'>Browse our available healthcare professionals.</p>
           </div>
           <div className='flex w-14 h-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600'>
            <Stethoscope size={28}/>
           </div>
          </div>
          <div className='my-6 h-px bg-slate-100'/>
          <div className='grid grid-cols-2 gap-3'>
           <div className='rounded-2xl bg-emerald-50 p-4'>
            <div className='mb-3 flex w-10 h-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm'>
             <BadgeCheck size={21}/>
            </div>
            <p className='text-lg font-bold text-slate-900'>{doctors.filter((doctor) => doctor.available).length}</p>
            <p className='mt-1 text-xs text-slate-500'>Available Now</p>
           </div>
           <div className='rounded-2xl bg-blue-50 p-4'>
            <div className='mb-3 flex w-10 h-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm'>
             <Users size={21}/>
            </div>
            <p className='text-lg font-bold text-slate-900'>{new Set( doctors .map((doctor) => doctor.speciality) .filter(Boolean)).size}</p>
            <p className='mt-1 text-xs text-slate-500'>Specialities</p>
           </div>
          </div>
          <button className='mt-5 cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-600' type='button' onClick={()=>document.getElementById("doctor-directory")?.scrollIntoView({behavior: "smooth"})}>
           Explore Doctors
           <ArrowRight size={17}/>
          </button>
         </div>
        </div>
       </div>
      </div>
     </section>
     {/* --doctor-directory-- */}
     <section className='mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8' id='doctor-directory'>
      <div className='mb-8'>
       <div className='mb-3 flex items-center gap-2 text-blue-600'>
        <span className='w-8 h-1 rounded-full bg-blue-600'/>
        <span className='text-xs font-bold uppercase tracking-[0.18em]'>Doctor Directory</span>
       </div>
       <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h2 className='text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl'>Explore Our Specialities</h2>
          <p className='mt-2 text-sm leading-6 text-slate-500 sm:text-base'>Search by doctor name, speciality, qualification, or city.</p>
        </div>
        <p className='text-sm font-medium text-slate-500'>
          Showing{" "}
          <span className='font-bold text-slate-900'>{filteredDoctors.length}</span>{" "}
          of {doctors.length} doctors
        </p>
       </div>
      </div>
      {/* --search-filters-- */}
      <div className='mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5'>
       <div className='grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_220px_200px_auto]'>
        <div className='relative'>
         <Search size={20} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'/>
         <input className='w-full h-12 rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50' type="text" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder='Search Doctor, Speciality, etc...' />
         {searchTerm && (
          <button className='absolute cursor-pointer right-3 top-1/2 flex w-8 h-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700' type='button' onClick={()=>setSearchTerm("")}>
           <X size={17}/>
          </button>
         )}
        </div>
        {/* ---availability-filter-- */}
        <div className='relative'>
         <Filter size={17} className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'/>
         <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)} aria-label="Filter by availability" className="h-12 w-full appearance-none rounded-xl border border-slate-200 cursor-pointer bg-white pl-10 pr-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50" >
         <option value="All">All Availability</option>
         <option value="Available">Available</option>
         <option value="Unavailable">Unavailable</option>
         </select>
        </div>
        {/* --sort-doctors-- */}
        <div className='relative'>
         <SlidersHorizontal size={17} className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'/>
         <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort doctors" className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50 cursor-pointer" >
          <option value="default">Sort: Default</option>
         <option value="fees-low">Fees: Low to High</option>
         <option value="fees-high">Fees: High to Low</option>
         <option value="experience">Most Experienced</option>
         </select>
        </div>
        {/* --clear-filters-- */}
        <button className='inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600' type='button' onClick={clearFilters}>
         <X size={16}/>
         Clear Filters
        </button>
       </div>
       {/* --speciality-chips-- */}
       <div className='mt-5 border-t border-slate-100 pt-5'>
        <p className='mb-3 text-xs font-bold uppercase tracking-wider text-slate-400'>Browse By Speciality</p>
        <div className='flex gap-2.5 overflow-x-auto pb-1'>
         {specialityList.map((item)=>(
          <button className={`shrink-0 cursor-pointer rounded-full border px-4 py-2.5 text-xs font-semibold transition sm:text-sm ${selectedSpeciality === item ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/15":"border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"}`} type='button' key={item} onClick={()=>handleSpeciality(item)}>
           {item}
          </button>
         ))}
        </div>
       </div>
      </div>
      {filteredDoctors.length === 0 ? (
        <div className='rounded-3xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm sm:px-10'>
         <div className='mx-auto flex w-16 h-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600'>
          <Search size={28}/>
         </div>
         <h3 className='mt-5 text-xl font-bold text-slate-900'>No Doctors Found</h3>
         <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500'>We couldn't find doctors matching your search or selected filters. Try a different name, city, or speciality.</p>
         <button type="button" onClick={clearFilters} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700" > <X size={16} /> Clear All Filters </button>
        </div>
      ):(
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
         {filteredDoctors.map((item)=>(
          <article className='group flex h-full cursor-pointer flex-col overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_6px_25px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-100 hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)]' key={item._id}>
           {/* --doctor-image-- */}
           <div className='relative h-64 overflow-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50 sm:h-60'>
            <img className='w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105' src={item.image} loading='lazy' alt="" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/20 to-transparent" />
            <div className='absolute left-4 top-4'>
             <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold shadow-sm backdrop-blur-md ${item.available ? "border-emerald-100 bg-white/95 text-emerald-700":"border-slate-200 bg-white/95 text-slate-500"}`}>
               <span className={`w-2 h-2 rounded-full ${item.available ? "bg-emerald-500":"bg-slate-400"}`}/>
               {item.available ? "Available":"Unavailable"}
             </span>
            </div>
            <div className='absolute right-4 top-4 flex w-10 h-10 items-center justify-center rounded-xl border border-white/80 bg-white/95 text-blue-600 shadow-sm'>
             <BadgeCheck size={21}/>
            </div>
            <button type='button' onClick={()=>handleAppointment(item._id)} disabled={!item.available} className='absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-800 shadow-lg transition hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer'>
             <ArrowUpRight size={20}/>
            </button>
           </div>
           {/* --doctor-information-- */}
           <div className='flex flex-1 flex-col p-5'>
            <div className='mb-3 flex items-center gap-2'>
             <div className='flex w-8 h-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
              <Stethoscope size={16}/>
             </div>
             <span className='text-xs font-bold uppercase tracking-wide text-blue-600'>
              {item.speciality || "General"}
             </span>
            </div>
            <h3 className='text-lg font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-blue-600'>{item.name}</h3>
            <p className='mt-1 text-sm text-slate-500'>{item.degree || "Medical Professional"}</p>
            <div className="my-5 h-px bg-slate-100" />
            <div className='grid grid-cols-2 gap-3'>
             <div className='rounded-xl bg-slate-50 p-3'>
              <div className='mb-2 flex items-center gap-1.5 text-slate-400'>
               <Clock3 size={14}/>
               <span className='text-[10px] font-bold uppercase tracking-wide'>Experience</span>
              </div>
              <p className='text-sm font-bold text-slate-800'>{item.experience || "Not Specified"}</p>
             </div>
             <div className='rounded-xl bg-slate-50 p-3'>
              <div className='mb-2 flex items-center gap-1.5 text-slate-400'>
               <HeartPulse size={14}/>
               <span className='text-[10px] font-bold uppercase tracking-wide'>Consultation Fees</span>
              </div>
              <p className="text-sm font-extrabold text-slate-800">{item.fees != null ? `₹${item.fees}` : "Not specified"}</p>
             </div>
            </div>
            <div className='mt-auto pt-5'>
             <button type="button" onClick={() => handleAppointment(item._id)} disabled={!item.available} className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 cursor-pointer text-sm font-bold transition ${ item.available ? "bg-slate-900 text-white hover:bg-blue-600" : "cursor-not-allowed bg-slate-100 text-slate-400" }` }>
            <CalendarCheck size={17} />{item.available ? "Book Appointment" : "Not Available"}
             {item.available && ( 
              <ArrowRight size={16} className="ml-auto transition-transform group-hover:translate-x-1" />
               )}
             </button>
            </div>
           </div>
          </article>
         ))}
        </div>
      )}
     </section>
    </main>
  )
}

export default Doctor