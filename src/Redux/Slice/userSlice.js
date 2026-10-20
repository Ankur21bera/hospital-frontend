import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from 'axios';

const backendUrl = "https://hospital-backend-gray.vercel.app"

// --session-storage-helpers--

const getStoredUser = () => {
    try {
        const userData = sessionStorage.getItem("userData");
        if(!userData){
            return null;
        }
        return JSON.parse(userData);
    } catch (error) {
        return null;
    }
}

const getToken = () => {
    return sessionStorage.getItem("userToken")
}

const saveUserSession = (token,user)=>{
    if(token){
        sessionStorage.setItem("userToken",token);
    }
    if(user){
        sessionStorage.setItem("userData",JSON.stringify(user))
    }
}

const clearUserSession = () => {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userData");
}


// auth-header--
const authConfig = () => {
    const token = getToken();
    return {headers:{Authorization:`Bearer ${token}`}}
}

// --register-user--

export const registerUser = createAsyncThunk("user/registerUser",async(userData,{rejectWithValue})=>{
    try {
        const response = await axios.post(`${backendUrl}/api/user/register-user`,userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Registration Failed")
    }
})

// --login-user--
export const loginUser = createAsyncThunk("user/loginUser",async(loginData,{rejectWithValue})=>{
    try {
        const response = await axios.post(`${backendUrl}/api/user/login-user`,loginData);
        const data = response.data;
        if(data.token){
            saveUserSession(data.token,data.user);
        }
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Login Failed")
    }
})

// ---forgot-password--

export const forgotPassword = createAsyncThunk("user/forgotPassword",async(email,{rejectWithValue})=>{
    try {
        const response = await axios.post(`${backendUrl}/api/user/forgot-password`,{email});
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed To Send Otp")
    }
})

// --verify-otp-/-

export const verifyOtp = createAsyncThunk("user/verifyOtp",async(otpData,{rejectWithValue})=>{
    try {
        const response = await axios.post(`${backendUrl}/api/user/verify-otp`,otpData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Otp Verification Failed")
    }
})

// ---resend-otp--
export const resendOtp = createAsyncThunk("user/resendOtp",async(email,{rejectWithValue})=>{
    try {
        const response = await axios.post(`${backendUrl}/api/user/resend-otp`,{email});
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed To Resend Otp")
    }
})

// ---reset-password--

export const resetPassword = createAsyncThunk("user/resetPassword",async(passwordData,{rejectWithValue})=>{
    try {
        const response = await axios.post(`${backendUrl}/api/user/reset-password`,passwordData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Password Reset Failed")
    }
})

// ---get-profile--
export const getProfile = createAsyncThunk("user/getProfile",async(_,{rejectWithValue})=>{
    try {
        const response = await axios.get(`${backendUrl}/api/user/user-profile`,authConfig());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed To Fetch Profile")
    }
})

// --update-profile--

export const updateProfile = createAsyncThunk("user/updateProfile",async(formData,{rejectWithValue})=>{
    try {
        const response = await axios.put(`${backendUrl}/api/user/update-profile`,formData,{headers:{Authorization:`Bearer ${getToken()}`,"Content-Type":"multipart/form-data"}})
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Profile Update Failed")
    }
})

// ---list-doctors--

export const listDoctors = createAsyncThunk("user/listDoctors",async(_,{rejectWithValue})=>{
    try {
        const response = await axios.get(`${backendUrl}/api/user/list-doctors`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed To Fetch Doctors")
    }
})

// ---book-appointment--

export const bookAppointment = createAsyncThunk("user/bookAppointment",async(appointmentData,{rejectWithValue})=>{
    try {
        const response = await axios.post(`${backendUrl}/api/user/book-appointment`,appointmentData,authConfig());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Appointment Booking Failed")
    }
})

// --list-appointments---

export const listAppointment = createAsyncThunk("user/listAppointment",async(_,{rejectWithValue})=>{
    try {
        const response = await axios.put(`${backendUrl}/api/user/list-appointment`,{},authConfig());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed To Fetch Appointments")
    }
})

// --cancel-appointment--

export const cancelAppointment = createAsyncThunk("user/cancelAppointment",async(appointmentId,{rejectWithValue})=>{
   try {
    const response = await axios.post(`${backendUrl}/api/user/cancel-appointment`,{appointmentId},authConfig());
    return response.data;
   } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed To Cancel Appointment")
   }
})

// ---request-offline-payment--

export const requestOfflinePayment = createAsyncThunk("user/requestOfflinePayment",async(appointmentId,{rejectWithValue})=>{
    try {
        const response = await axios.post(`${backendUrl}/api/user/offline-payment`,{appointmentId},authConfig());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Offline Payment Request Failed")
    }
})

export const createRazorpayOrder = createAsyncThunk("user/createOrderRazorpay",async(appointmentId,{rejectWithValue})=>{
    try {
        const response = await axios.post(`${backendUrl}/api/user/create-razorpay`,{appointmentId},authConfig());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed To Create Razorpay Order")
    }
})

// ---verify-razorpay-payment--

export const verifyRazorpayPayment = createAsyncThunk("user/verifyRazorpayPayment",async(paymentData,{rejectWithValue})=>{
    try {
        const response = await axios.post(`${backendUrl}/api/user/verify-razorpay`,paymentData,authConfig());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Razorpay Verification Failed")
    }
})

// create--stripe-payment--

export const createStripeCheckoutSession =
  createAsyncThunk(
    "user/createStripeCheckoutSession",
    async (
      appointmentId,
      { rejectWithValue }
    ) => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/user/create-stripe`,
          {
            appointmentId,
          },
          authConfig()
        );

        console.log(
          "Stripe API Response:",
          response.data
        );

        if (!response.data?.success) {
          return rejectWithValue(
            response.data?.message ||
              "Failed To Create Stripe Session"
          );
        }

        if (
          typeof response.data?.url !== "string" ||
          !response.data.url.startsWith(
            "https://checkout.stripe.com/"
          )
        ) {
          return rejectWithValue(
            "Stripe Checkout URL is missing or invalid"
          );
        }

        return response.data;

      } catch (error) {
        console.error(
          "Stripe API Error:",
          error.response?.data ||
            error.message
        );

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed To Create Stripe Session"
        );
      }
    }
  );


// ---verify-stripe-payment--

export const verifyStripePayment = createAsyncThunk("user/verifyStripePayment",async(sessionId,{rejectWithValue})=>{
    try {
        const response = await axios.post(`${backendUrl}/api/user/verify-stripe`,{sessionId},authConfig());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed To Verify Stripe")
    }
})

export const submitEnquiry = createAsyncThunk("user/submitEnquiry",async(enquiryData,{rejectWithValue})=>{
    try {
        const response = await axios.post(`${backendUrl}/api/user/submit-enquiry`,enquiryData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed To Submit Enquiry")
    }
})

// apply-job-/-
export const applyJob = createAsyncThunk("user/applyJob",async(formData,{rejectWithValue})=>{
    try {
        const response = await axios.post(`${backendUrl}/api/user/apply-job`,formData,{headers:{"Content-Type":"multipart/form-data"}});
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Job Application Failed")
    }
})

// ---get-holidays--

export const getHolidays = createAsyncThunk("user/getUserHolidays",async(_,{rejectWithValue})=>{
    try {
        const response = await axios.get(`${backendUrl}/api/user/list-holidays`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed To Fetch Holidays")
    }
})

// update--booking--

export const updateAppointment = createAsyncThunk("user/updateAppointment",async({appointmentId,slotDate,slotTime},{rejectWithValue})=>{
    try {
        const response = await axios.put(`${backendUrl}/api/user/update-booking/${appointmentId}`,{slotDate,slotTime},authConfig());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed To Update Appointment")
    }
})

// initial-state--
const initialState = {
    token:getToken(),
    user:getStoredUser(),
    doctors:[],
    appointments:[],
    holidays:[],
    selectedDoctor:null,
    selectedAppointment:null,
    razorpayOrder:null,
    stripeSession:null,
    loading:false,
    authLoading:false,
    profileLoading:false,
    doctorsLoading:false,
    appointmentsLoading:false,
    paymentLoading:false,
    enquiryLoading:false,
    jobLoading:false,
    holidaysLoading:false,
    error:null,
    authError:null,
    profileError:null,
    doctorsError:null,
    appointmentsError:null,
    paymentError:null,
    enquiryError:null,
    jobError:null,
    holidaysError:null,
    registerSuccess:false,
    loginSuccess:false,
    forgotPasswordSuccess:false,
    otpVerified:false,
    resetPasswordSuccess:false,
    profileUpdateSuccess:false,
    appointmentSuccess:false,
    appointmentCancelSuccess:false,
    appointmentUpdateSuccess:false,
    offlinePaymentSuccess:false,
    razorpaySuccess:false,
    stripeSuccess:false,
    enquirySuccess:false,
    jobApplicationSuccess:false,
    message:null
}

// slice---

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        clearUserError: (state) => {
            state.error = null;
            state.authError = null;
            state.profileError = null;
            state.doctorsError = null;
            state.appointmentsError = null;
            state.paymentError = null;
            state.enquiryError = null;
            state.jobError = null;
            state.holidaysError = null;
        },
        clearUserMessage: (state) => {
            state.message = null;
        },
        resetUserSuccessStates:(state) => {
            state.registerSuccess = false;
            state.loginSuccess = false;
            state.forgotPasswordSuccess = false;
            state.otpVerified = false;
            state.resetPasswordSuccess = false;
            state.profileUpdateSuccess = false;
            state.appointmentSuccess = false;
            state.appointmentCancelSuccess = false;
            state.appointmentUpdateSuccess = false;
            state.offlinePaymentSuccess = false;
            state.razorpaySuccess = false;
            state.stripeSuccess = false;
            state.enquirySuccess = false;
            state.jobApplicationSuccess = false;
        },
        logoutUser:(state) => {
            clearUserSession();
            state.token = null;
            state.user = null;
            state.appointments = [];
            state.selectedAppointment = null;
            state.razorpayOrder = null;
            state.stripeSession = null;
            state.message = null;
            state.error = null;
            state.authError = null;
            state.profileError = null;
            state.appointmentsError = null;
            state.paymentError = null;
        },
        setSelectedDoctor:(state,action)=>{
            state.selectedDoctor = action.payload;
        },
        setSelectedAppointment:(state,action)=>{
            state.selectedAppointment = action.payload;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(registerUser.pending,(state)=>{
            state.authLoading = true;
            state.authError = null;
            state.registerSuccess = false;
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.authLoading = false;
            state.registerSuccess = true;
            state.message = action.payload.message || "Registration Successfull";
            state.authError = null
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.authLoading = false;
            state.registerSuccess = false;
            state.authError = action.payload;
        })

        .addCase(loginUser.pending,(state)=>{
            state.authLoading = true;
            state.authError = null;
            state.loginSuccess = false
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.authLoading = false;
            state.loginSuccess = true;
            state.token = action.payload.token || null;
            state.user = action.payload.user || null;
            state.message = action.payload.message || "Login Successfull";
            state.authError = null
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.authLoading = false;
            state.loginSuccess = false;
            state.authError = action.payload;
        })

        .addCase(forgotPassword.pending,(state)=>{
            state.authLoading = true;
            state.authError = null;
            state.forgotPasswordSuccess = false;
        })
        .addCase(forgotPassword.fulfilled,(state,action)=>{
            state.authLoading = false;
            state.forgotPasswordSuccess = true;
            state.message = action.payload.message;
            state.authError = null;
        })
        .addCase(forgotPassword.rejected,(state,action)=>{
            state.authLoading = false;
            state.forgotPasswordSuccess = false;
            state.authError = action.payload;
        })

        .addCase(verifyOtp.pending,(state)=>{
            state.authLoading = true;
            state.authError = null;
            state.otpVerified = false;
        })
        .addCase(verifyOtp.fulfilled,(state,action)=>{
            state.authLoading = false;
            state.otpVerified = true;
            state.message = action.payload.message;
            state.authError = null
        })
        .addCase(verifyOtp.rejected,(state,action)=>{
            state.authLoading = false;
            state.otpVerified = false;
            state.authError = action.payload
        })

        .addCase(resendOtp.pending, (state) => {
        state.authLoading = true;
        state.authError = null;
      })

      .addCase(resendOtp.fulfilled, (state, action) => {
        state.authLoading = false;
        state.message = action.payload.message;
        state.authError = null;
      })

      .addCase(resendOtp.rejected, (state, action) => {
        state.authLoading = false;
        state.authError = action.payload;
      })

      .addCase(resetPassword.pending,(state)=>{
        state.authLoading = true;
        state.authError = null;
        state.resetPasswordSuccess = false;
      })
      .addCase(resetPassword.fulfilled,(state,action)=>{
        state.authLoading = false;
        state.resetPasswordSuccess = true;
        state.message = action.payload.message;
        state.authError = null;
      })
      .addCase(resetPassword.rejected,(state,action)=>{
        state.authLoading = false;
        state.resetPasswordSuccess = false;
        state.authError = action.payload;
      })

      .addCase(getProfile.pending,(state)=>{
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(getProfile.fulfilled,(state,action)=>{
        state.profileLoading = false;
        state.user = action.payload.user || null;
        state.profileError = null;
        if(action.payload.user){
            sessionStorage.setItem("userData",JSON.stringify(action.payload.user))
        }
        state.message = action.payload.message
      })
      .addCase(getProfile.rejected,(state,action)=>{
        state.profileLoading = false;
        state.profileError = action.payload;
      })

      .addCase(updateProfile.pending,(state)=>{
        state.profileLoading = true;
        state.profileError = null;
        state.profileUpdateSuccess = false;
      })
      .addCase(updateProfile.fulfilled,(state,action)=>{
        state.profileLoading = false;
        state.profileUpdateSuccess = true;
        state.user = action.payload.user || state.user;
        if(action.payload.user){
            sessionStorage.setItem("userData",JSON.stringify(action.payload.user))
        }
        state.message = action.payload.message;
        state.profileError = null;
      })
      .addCase(updateProfile.rejected,(state,action)=>{
        state.paymentLoading = false;
        state.profileUpdateSuccess = false;
        state.profileError = action.payload;
      })

      .addCase(listDoctors.pending,(state)=>{
        state.doctorsLoading = true;
        state.doctorsError = null;
      })
      .addCase(listDoctors.fulfilled,(state,action)=>{
        state.doctorsLoading = false;
        state.doctors = action.payload.doctors || [];
        state.doctorsError = null
      })
      .addCase(listDoctors.rejected,(state,action)=>{
        state.doctorsLoading = false;
        state.doctorsError = action.payload;
      })

      .addCase(bookAppointment.pending,(state)=>{
        state.appointmentsLoading = true;
        state.appointmentsError = null;
        state.appointmentSuccess = false
      })
      .addCase(bookAppointment.fulfilled,(state,action)=>{
        state.appointmentsLoading = false;
        state.appointmentSuccess = true;
        state.message = action.payload.message;
        state.appointmentsError = null;
        if(action.payload.appointment){
            state.appointments.unshift(action.payload.appointment);
        }
      })
      .addCase(bookAppointment.rejected,(state,action)=>{
        state.appointmentsLoading = false;
        state.appointmentSuccess = false;
        state.appointmentsError = action.payload;
      })

      .addCase(listAppointment.pending,(state)=>{
        state.appointmentsLoading = true
        state.appointmentsError = null;
      })
      .addCase(listAppointment.fulfilled,(state,action)=>{
        state.appointmentsLoading = false;
        state.appointments = action.payload.appointments || [];
        state.appointmentsError = null;
        state.message = action.payload.message
      })
      .addCase(listAppointment.rejected,(state,action)=>{
        state.appointmentsLoading = false;
        state.appointmentsError = action.payload;
      })

      .addCase(cancelAppointment.pending,(state)=>{
        state.appointmentsLoading = true;
        state.appointmentsError = null;
        state.appointmentCancelSuccess = false;
      })
      .addCase(cancelAppointment.fulfilled,(state,action)=>{
        state.appointmentsLoading = false;
        state.appointmentCancelSuccess = true;
        state.message = action.payload.message;
        state.appointmentsError = null;
      })
      .addCase(cancelAppointment.rejected,(state,action)=>{
        state.appointmentsLoading = false;
        state.appointmentCancelSuccess = false;
        state.appointmentsError = action.payload;
      })

      .addCase(updateAppointment.pending,(state)=>{
        state.appointmentsLoading = true;
        state.appointmentsError = null;
        state.appointmentUpdateSuccess = false;
      })
      .addCase(updateAppointment.fulfilled,(state,action)=>{
        state.appointmentsLoading = false;
        state.appointmentUpdateSuccess = true;
        state.message = action.payload.message;
        state.appointmentsError = null;
        const updatedAppointment = action.payload.appointment;
        if(updatedAppointment?._id){
         state.appointments = state.appointments.map((appointment)=>appointment._id === updatedAppointment._id ? updatedAppointment : appointment)
        }
      })

      .addCase(updateAppointment.rejected,(state,action)=>{
        state.appointmentsLoading = false;
        state.appointmentUpdateSuccess = false;
        state.appointmentsError = action.payload
      })

       .addCase(requestOfflinePayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
        state.offlinePaymentSuccess = false;
      })

      .addCase(requestOfflinePayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.offlinePaymentSuccess = true;
        state.message = action.payload.message;
        state.paymentError = null;
      })

      .addCase(requestOfflinePayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.offlinePaymentSuccess = false;
        state.paymentError = action.payload;
      })

      .addCase(createRazorpayOrder.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
        state.razorpayOrder = null;
      })

      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.razorpayOrder = action.payload.order || null;
        state.paymentError = null;
      })

      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.paymentLoading = false;
        state.razorpayOrder = null;
        state.paymentError = action.payload;
      })

      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
        state.razorpaySuccess = false;
      })

      .addCase(verifyRazorpayPayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.razorpaySuccess = true;
        state.message = action.payload.message;
        state.paymentError = null;
      })

      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.razorpaySuccess = false;
        state.paymentError = action.payload;
      })

        .addCase(createStripeCheckoutSession.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
        state.stripeSession = null;
      })

      .addCase(createStripeCheckoutSession.fulfilled, (state, action) => {
        state.paymentLoading = false;

        state.stripeSession = {
          sessionId: action.payload.sessionId,
          url: action.payload.url,
        };

        state.paymentError = null;
      })

      .addCase(createStripeCheckoutSession.rejected, (state, action) => {
        state.paymentLoading = false;
        state.stripeSession = null;
        state.paymentError = action.payload;
      })

       .addCase(verifyStripePayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
        state.stripeSuccess = false;
      })

      .addCase(verifyStripePayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.stripeSuccess = true;
        state.message = action.payload.message;
        state.paymentError = null;
      })

      .addCase(verifyStripePayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.stripeSuccess = false;
        state.paymentError = action.payload;
      })

      .addCase(submitEnquiry.pending,(state)=>{
        state.enquiryLoading = true;
        state.enquiryError = null;
        state.enquirySuccess = false
      })
      .addCase(submitEnquiry.fulfilled,(state,action)=>{
        state.enquiryLoading = false;
        state.enquirySuccess = true;
        state.message = action.payload.message;
        state.enquiryError = null
      })
      .addCase(submitEnquiry.rejected,(state,action)=>{
        state.enquiryLoading = false;
        state.enquirySuccess = false;
        state.enquiryError = action.payload;
      })

      .addCase(applyJob.pending,(state)=>{
        state.jobLoading = true;
        state.jobError = null;
        state.jobApplicationSuccess = false
      })
      .addCase(applyJob.fulfilled,(state,action)=>{
        state.jobLoading = false;
        state.jobApplicationSuccess = true;
        state.message = action.payload.message;
        state.jobError = null;
      })
      .addCase(applyJob.rejected,(state,action)=>{
        state.jobLoading = false;
        state.jobApplicationSuccess = false;
        state.jobError = action.payload;
      })

      .addCase(getHolidays.pending,(state)=>{
        state.holidaysLoading = true;
        state.holidaysError = null;
      })
      .addCase(getHolidays.fulfilled,(state,action)=>{
        state.holidaysLoading = false;
        state.holidays = action.payload.holidays || [];
        state.holidaysError = null;
      })
      .addCase(getHolidays.rejected,(state,action)=>{
        state.holidaysLoading = false;
        state.holidaysError = action.payload;
      })
    }
})

export const {clearUserError,clearUserMessage,resetUserSuccessStates,logoutUser,setSelectedDoctor,setSelectedAppointment} = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectUserToken = (state) => state.user.token;
export const selectDoctors = (state) => state.user.doctors;
export const selectAppointments = (state) => state.user.appointments;
export const selectHolidays = (state) => state.user.holidays;

export default userSlice.reducer;