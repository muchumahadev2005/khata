import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      handleGoogleSuccess(tokenResponse);
    },
    onError: () => alert("Google Login Failed"),
    flow: "implicit",
  });

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credentialResponse.credential || credentialResponse,
      });

      // ✅ Save JWT
      localStorage.setItem("token", res.data.token);

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
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
          <div className="google-login-wrapper w-full flex justify-center">
            <GoogleSignButton googleLogin={googleLogin} />
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

function GoogleSignButton({ googleLogin }: { googleLogin: () => void }) {
  const [active, setActive] = useState(false);

  return (
    <button
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onClick={() => googleLogin()}
      className={`flex items-center gap-4 px-4 py-3 rounded-md shadow-sm w-full max-w-md justify-center google-custom-btn transition-colors duration-150 ${active ? 'bg-sky-600 text-white' : 'bg-sky-400 text-white hover:bg-sky-500'}`}
      type="button"
    >
      <span className="bg-white p-1 rounded-sm border mr-3">
        <svg
          width="18"
          height="18"
          viewBox="0 0 533.5 544.3"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="#4285F4"
            d="M533.5 278.4c0-18.1-1.5-35.5-4.3-52.3H272.1v99.1h147.1c-6.3 33.9-25.8 62.6-55 81.7v67.9h88.8c52-48 81.4-118.6 81.4-196.4z"
          />
          <path
            fill="#34A853"
            d="M272.1 544.3c73.7 0 135.6-24.5 180.8-66.6l-88.8-67.9c-24.7 16.6-56.3 26.4-92 26.4-70.7 0-130.6-47.7-152-111.8H29.6v70.3C74.7 485.2 167 544.3 272.1 544.3z"
          />
          <path
            fill="#FBBC05"
            d="M120.1 323.9c-11.9-35.4-11.9-73.4 0-108.8V144.8H29.6C10.6 183.7 0 231 0 278.4s10.6 94.7 29.6 133.6l90.5-88.1z"
          />
          <path
            fill="#EA4335"
            d="M272.1 109.7c39 0 74 13.4 101.6 39.6l76.2-76.2C407.6 25.2 345.8 0 272.1 0 167 0 74.7 59.1 29.6 144.8l90.5 70.3c21.4-64.1 81.3-111.8 152-111.8z"
          />
        </svg>
      </span>
      <span className="text-sm font-medium">Sign in with Google</span>
    </button>
  );
}
