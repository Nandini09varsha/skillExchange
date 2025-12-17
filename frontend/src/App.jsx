// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import { useAuth } from "./context/AuthContext";

// export default function App() {
//   const { isAuth } = useAuth();

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route
//           path="/"
//           element={isAuth ? <Home /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/login"
//           element={!isAuth ? <Login /> : <Navigate to="/" />}
//         />
//         <Route
//           path="/register"
//           element={!isAuth ? <Register /> : <Navigate to="/" />}
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { useAuth } from "./context/AuthContext";
import MatchPage from "./pages/MatchPage";


export default function App() {
  const { isAuth } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuth ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/" />} />
        <Route
          path="/register"
          element={!isAuth ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={isAuth ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
  path="/matches"
  element={isAuth ? <MatchPage /> : <Navigate to="/login" />}
/>

      </Routes>
    </BrowserRouter>
  );
}
