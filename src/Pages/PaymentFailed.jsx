import React from "react";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {

    const navigate = useNavigate();

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">

            <div className="w-full max-w-lg text-center">

                <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center">

                    <XCircle
                        size={48}
                        className="text-red-600"
                    />

                </div>

                <h1 className="text-3xl font-extrabold text-slate-900 mt-6">
                    Payment Cancelled
                </h1>

                <p className="text-slate-500 mt-3">
                    Your Stripe payment was cancelled or could not be completed.
                </p>

                <button
                    onClick={() =>
                        navigate("/my-appointments")
                    }
                    className="mt-7 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
                >
                    Back to My Appointments
                </button>

            </div>

        </div>
    );
};

export default PaymentFailed;