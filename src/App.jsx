// import React from "react";
// import { useSelector } from "react-redux";
// import Navbar from "./Components/Navbar";
// import { Toaster } from "react-hot-toast";
// import { Navigate, Route, Routes } from "react-router-dom";
// import Home from "./Pages/Home";
// import Doctor from "./Pages/Doctor";
// import Login from "./Pages/Login";
// import About from "./Pages/About";
// import Contact from "./Pages/Contact";
// import Myprofile from "./Pages/Myprofile";
// import Myappointment from "./Pages/Myappointment";
// import Appointment from "./Pages/Appointment";
// import Footer from "./Components/Footer";
// import PaymentFailed from "./Pages/PaymentFailed";
// import PaymentSuccess from "./Pages/PaymentSuccess";

// const App = () => {
//   const { token } = useSelector((state) => state.user);
//   const isLoggedIn = Boolean(token);
//   return (
//     <div className="min-h-screen flex flex-col bg-white">
//       <Navbar />
//       <Toaster
//         position="top-right"
//         reverseOrder={false}
//         toastOptions={{
//           duration: 3000,
//           style: {
//             borderRadius: "12px",
//             padding: "12px 16px",
//             fontSize: "14px",
//           },
//         }}
//       />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/doctors" element={<Doctor />} />
//         <Route path="/doctors/:speciality" element={<Doctor />} />
//         <Route
//           path="/login"
//           element={isLoggedIn ? <Navigate to="/" replace /> : <Login />}
//         />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route
//           path="/my-profile"
//           element={
//             isLoggedIn ? <Myprofile /> : <Navigate to="/login" replace />
//           }
//         />
//         <Route
//           path="/my-appointments"
//           element={
//             isLoggedIn ? <Myappointment /> : <Navigate to="/login" replace />
//           }
//         />
//         <Route
//           path="/appointment/:docId"
//           element={
//             isLoggedIn ? <Appointment /> : <Navigate to="/login" replace />
//           }
//         />
//         <Route path="*" element={<Navigate to="/" replace />} />
//         <Route
//           path="/payment-success"
//           element={
//             isLoggedIn ? <PaymentSuccess /> : <Navigate to="/login" replace />
//           }
//         />

//         <Route
//           path="/payment-failed"
//           element={
//             isLoggedIn ? <PaymentFailed /> : <Navigate to="/login" replace />
//           }
//         />
//       </Routes>
//       <Footer />
//     </div>
//   );
// };

// export default App;



import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./Components/Navbar";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./Pages/Home";
import Doctor from "./Pages/Doctor";
import Login from "./Pages/Login";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Myprofile from "./Pages/Myprofile";
import Myappointment from "./Pages/Myappointment";
import Appointment from "./Pages/Appointment";
import Footer from "./Components/Footer";
import PaymentFailed from "./Pages/PaymentFailed";
import PaymentSuccess from "./Pages/PaymentSuccess";

const App = () => {
  const { token } = useSelector((state) => state.user);
  const isLoggedIn = Boolean(token);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "14px",
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/doctors" element={<Doctor />} />

        <Route
          path="/doctors/:speciality"
          element={<Doctor />}
        />

        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/" replace /> : <Login />
          }
        />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        {/* Appointment page is now accessible without login */}
        <Route
          path="/appointment/:docId"
          element={<Appointment />}
        />

        {/* Protected Routes */}
        <Route
          path="/my-profile"
          element={
            isLoggedIn ? (
              <Myprofile />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/my-appointments"
          element={
            isLoggedIn ? (
              <Myappointment />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/payment-success"
          element={
            isLoggedIn ? (
              <PaymentSuccess />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/payment-failed"
          element={
            isLoggedIn ? (
              <PaymentFailed />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
