import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
function App() {
  const { userAuth, checkUserAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkUserAuth();
  }, [checkUserAuth]);
  if (isCheckingAuth) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  return (
    <main className="w-full h-screen">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={userAuth ? <HomePage /> : <Navigate to="/signin" />}
        />
        <Route
          path="/signup"
          element={!userAuth ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/signin"
          element={!userAuth ? <Signin /> : <Navigate to="/" />}
        />
        <Route path="/setting" element={<div>Setting</div>} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </main>
  );
}

export default App;
