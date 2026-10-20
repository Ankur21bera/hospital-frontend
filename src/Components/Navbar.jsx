import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom'
import { logoutUser, resetUserSuccessStates } from '../Redux/Slice/userSlice';
import toast from 'react-hot-toast';
import { Activity, CalendarDays, ChevronDown, CircleUserRound, HeartPulse, Home, Info, LogOut, Mail, Menu, Stethoscope, UserRound, X } from 'lucide-react';
import { assets } from '../assets/assets';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {token,user} = useSelector((state)=>state.user);
  const [showMenu,setShowMenu] = useState(false);
  const [showDropdown,setShowDropDown] = useState(false);

  // --logout--
  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(resetUserSuccessStates());
    setShowDropDown(false);
    setShowMenu(false);
    toast.success("Logout Successfully");
    navigate("/login",{replace:true})
  }

  // --navigation--
  const handleNavigate = (path) => {
    navigate(path);
    setShowDropDown(false);
    setShowMenu(false);
  }

  // --desktop-link--

  const desktopLinkClass = ({isActive})=>`group relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive ? "bg-blue-50 text-blue-600":"text-slate-600 hover:bg-slate-50 hover:text-blue-600"}`;

  // --mobile-link--
  const mobileLinkClass = ({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${isActive ? "bg-blue-50 text-blue-600":"text-slate-600 hover:bg-slate-50"}`

  return (
    <div>
     <nav className='sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80'>
      <div className='max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8'>
       <div className='h-[76px] flex items-center justify-between'>
        {/* --logo-- */}
        <button className='flex items-center gap-3 cursor-pointer group' type='button' onClick={()=>handleNavigate("/")}>
         <div className='relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-200/60 group-hover:scale-105 transition-transform'>
          <HeartPulse size={24} className='text-white'/>
         </div>
         <div className='hidden sm:block text-left'>
          <p className='text-[17px] font-extrabold tracking-tight text-slate-900'>Prescripto</p>
          <p className='text-[10px] uppercase tracking-[0.16em] font-bold text-slate-400'>Healthcare Management</p>
         </div>
        </button>
        {/* ---desktop-navbar-- */}
        <div className='hidden lg:flex items-center gap-1'>
         <NavLink to="/" className={desktopLinkClass}>
         <Home size={16}/>
          Home
         </NavLink>
         <NavLink to="/doctors" className={desktopLinkClass}>
         <Stethoscope size={16}/>
          All Doctors
         </NavLink>
         <NavLink to="/about" className={desktopLinkClass}>
         <Info size={16}/>
           About
         </NavLink>
         <NavLink to="/contact" className={desktopLinkClass}>
         <Mail size={16}/>
           Contact
         </NavLink>
        </div>
        {/* --right-side-- */}
        <div className='flex items-center gap-3'>
         {token ? (
          <div className='relative hidden md:block'>
           <button className='flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-2xl border border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40 transition cursor-pointer shadow-sm' type='button' onClick={()=>setShowDropDown((prev)=>!prev)}>
             <img className='w-9 h-9 rounded-xl object-cover border border-slate-200' src={user?.image || assets.profile_pic} alt="" />
             <div className='hidden xl:block text-left max-w-[120px]'>
              <p className='text-xs font-bold text-slate-900 truncate'>{user?.name || "Patient"}</p>
              <p className='text-[10px] text-slate-400 truncate'>Patient Account</p>
             </div>
             <ChevronDown size={16} className={`text-slate-400 transition-transform ${showDropdown ? "rotate-180":""}`}/>
           </button>
           {/* ---dropdown-menu-- */}
           {showDropdown && (
            <div className='absolute right-0 top-full mt-3 w-64 rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_-15px_rgba(15,23,42,0.25)] overflow-hidden'>
              <div className='p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-b border-slate-100'>
                <div className='flex items-center gap-3'>
                 <img className='w-11 h-11 rounded-xl object-cover border-2 border-white shadow-sm' src={user?.image || assets.profile_pic} alt="" />
                 <div className='min-w-0'>
                  <p className='text-sm font-extrabold text-slate-900 truncate'>{user?.name || "Patient"}</p>
                  <p className='text-xs text-slate-500 truncate mt-0.5'>{user?.email || ""}</p>
                 </div>
                </div>
              </div>
              <div className='p-2'>
               <button className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer' type='button' onClick={()=>handleNavigate("/my-profile")}>
                <div className='w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center'>
                 <CircleUserRound size={16}/>
                </div>
                My Profile
               </button>
               <button className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer' type='button' onClick={()=>handleNavigate("/my-appointments")}>
                 <div className='w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center'>
                  <CalendarDays size={16}/>
                 </div>
                 My Appointments
               </button>
              </div>
              <div className='border-t border-slate-100 p-2'>
               <button className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer' type='button' onClick={handleLogout}>
                 <div className='w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center'>
                  <LogOut size={16}/>
                 </div>
                 Logout
               </button>
              </div>
            </div>
           )}
          </div>
         ):(
          <button className='hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200/50 hover:from-blue-700 transition cursor-pointer' type='button' onClick={()=>navigate("/login")}>
           <UserRound size={17}/>
           Create Account
          </button>
         )}
         <button className='lg:hidden w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition cursor-pointer' type='button' onClick={()=>setShowMenu(true)}>
          <Menu size={22} className='text-slate-700'/>
         </button>
        </div>
       </div>
      </div>
     </nav>
     {/* ---mobile-sidebar-- */}
     {showMenu && (
      <div className='fixed inset-0 z-[100]'>
       <div className='abolute inset-0 bg-slate-950/40 backdrop-blur-sm' onClick={()=>setShowMenu(false)}/>
       <aside className='absolute right-0 top-0 h-full w-[88%] max-w-sm bg-white shadow-[-20px_0_60px_-20px_rgba(15,23,42,0.3)] flex flex-col'>
        {/* --header-- */}
        <div className='flex items-center justify-between px-5 py-5 border-b border-slate-200'>
         <button className='flex items-center gap-3 cursor-pointer' type='button' onClick={()=>handleNavigate("/")}>
          <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md'>
           <HeartPulse size={22} className='text-white'/>
          </div>
          <div className='text-left'>
            <p className='font-extrabold text-slate-900'>Prescripto</p>
            <p className='text-[9px] uppercase tracking-[0.15em] font-bold text-slate-400'>Healthcare</p>
          </div>
         </button>
         <button className='w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition cursor-pointer' type='button' onClick={()=>setShowMenu(false)}>
           <X size={21} className='text-slate-700'/>
         </button>
        </div>
        {/* --mobile-profile-card-- */}
        {token && (
          <div className='mx-4 mt-5 p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-200'>
           <div className='flex items-center gap-3'>
            <img className='w-12 h-12 rounded-xl object-cover border-2 border-white/60' src={user?.image || assets.profile_pic} alt="" />
            <div className='min-w-0'>
             <p className='font-extrabold truncate'>{user?.name || "Patient"}</p>
             <p className='text-xs text-blue-100 truncate mt-0.5'>{user?.email || ""}</p>
            </div>
           </div>
           <div className='mt-4 grid grid-cols-2 gap-2'>
            <div className='rounded-xl bg-white/10 border border-white/10 px-3 py-2'>
             <p className='text-[10px] text-blue-100'>Account</p>
             <p className="text-xs font-bold mt-0.5">Patient</p>
            </div>
            <div className='rounded-xl bg-white/10 border border-white/10 px-3 py-2'>
            <p className="text-[10px] text-blue-100">Status</p>
            <p className="text-xs font-bold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
              Active
            </p>
            </div>
           </div>
          </div>
        )}
        <div className='flex-1 overflow-y-auto px-4 py-6'>
         <p className='px-4 mb-2 text-[10px] uppercase tracking-[0.18em] font-extrabold text-slate-400'>
           Main Menu
         </p>
         <div className='space-y-1'>
          <NavLink to="/" onClick={()=>setShowMenu(false)} className={mobileLinkClass}>
          <Home size={18}/>
          Home
          </NavLink>
          <NavLink to="/doctors" onClick={()=>setShowMenu(false)} className={mobileLinkClass}>
          <Stethoscope size={18}/>
           All Doctors
          </NavLink>
          <NavLink to="/about" onClick={()=>setShowMenu(false)} className={mobileLinkClass}>
          <Info size={18}/>
           About
          </NavLink>
          <NavLink to="/contact" onClick={()=>setShowMenu(false)} className={mobileLinkClass}>
          <Mail size={18}/>
            Contact
          </NavLink>
         </div>
         {token && (
          <>
           <p className="px-4 mt-8 mb-2 text-[10px] uppercase tracking-[0.18em] font-extrabold text-slate-400">Patient Portal</p>
           <div className='space-y-1'>
            <button className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer' type='button' onClick={()=>handleNavigate("/my-profile")}>
             <CircleUserRound size={18}/>
             My Profile
            </button>
            <button className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer' type='button' onClick={()=>handleNavigate("/my-profile")}>
             <CalendarDays size={18}/>
             My Appointments
            </button>
           </div>
          </>
         )}
        </div>
        <div className='border-t border-slate-200 p-4'>
         {token ? (
          <button className='w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition cursor-pointer' type='button' onClick={handleLogout}>
           <LogOut size={17}/>
           Logout
          </button>
         ):(
          <button className='w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-sm shadow-lg shadow-blue-200/50 cursor-pointer' type='button' onClick={()=>handleNavigate("/login")}>
           <UserRound size={17}/>
           Create Account
          </button>
         )}
         <div className="flex items-center justify-center gap-2 mt-3 text-[10px] text-slate-400">
          <Activity size={12} />
          Secure Healthcare Portal
        </div>
        </div>
       </aside>
      </div>
     )}
    </div>
  )
}

export default Navbar