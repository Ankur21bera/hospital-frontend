import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { verifyStripePayment } from "../Redux/Slice/userSlice";

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);

  const [success, setSuccess] = useState(false);

  const [message, setMessage] = useState("");

  // =====================================================
  // IMPORTANT:
  // Prevent Stripe verification from running twice
  // =====================================================

  const verificationStarted = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      // -----------------------------------------------
      // Prevent duplicate verification / duplicate toast
      // -----------------------------------------------

      if (verificationStarted.current) {
        return;
      }

      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setLoading(false);
        setSuccess(false);
        setMessage("Stripe Session ID is missing.");
        return;
      }

      verificationStarted.current = true;

      try {
        const result = await dispatch(verifyStripePayment(sessionId)).unwrap();

        console.log("Stripe Verification Response:", result);

        if (result?.success) {
          setSuccess(true);

          setMessage(result.message || "Payment Successful");

          // ONLY ONE SUCCESS TOAST
          toast.success("Payment Successful!");
        } else {
          setSuccess(false);

          setMessage(result?.message || "Payment Verification Failed");

          // ONLY ONE ERROR TOAST
          toast.error(result?.message || "Payment Verification Failed");
        }
      } catch (error) {
        console.error("Stripe Verification Error:", error);

        setSuccess(false);

        const errorMessage =
          typeof error === "string"
            ? error
            : error?.message || "Payment Verification Failed";

        setMessage(errorMessage);

        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [dispatch, searchParams]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 size={50} className="mx-auto animate-spin text-indigo-600" />

          <h2 className="mt-5 text-2xl font-extrabold text-slate-900">
            Verifying Your Payment
          </h2>

          <p className="mt-2 text-slate-500">
            Please wait while we confirm your Stripe payment.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // RESULT
  // =====================================================

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        {success ? (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>

            <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
              Payment Successful
            </h1>

            <p className="mt-3 text-slate-500">{message}</p>

            <button
              type="button"
              onClick={() => navigate("/my-appointments")}
              className="mt-7 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
            >
              View My Appointments
            </button>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <XCircle size={48} className="text-red-600" />
            </div>

            <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
              Payment Verification Failed
            </h1>

            <p className="mt-3 text-slate-500">{message}</p>

            <button
              type="button"
              onClick={() => navigate("/my-appointments")}
              className="mt-7 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-indigo-600"
            >
              Back to My Appointments
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
