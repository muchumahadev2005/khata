import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { googleLogin, isAuthenticated, isLoading } = useAuth();

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    await googleLogin(credentialResponse.credential); // ✅ ID TOKEN
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-md p-8">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-700">
            KHATA
          </h1>
          <p className="mt-2 text-gray-600">
            Smart credit management for shops
          </p>
        </div>

        {/* Google Login */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex w-full justify-center px-4">
            <div className="flex w-full max-w-xs sm:max-w-sm md:max-w-md justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert("Google Login Failed")}
                theme="filled_blue"
                size="large"
                shape="rectangular"
              />
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Secure authentication powered by Google
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
