import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Signup = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome to Smart Credit Speak
          </CardTitle>
          <CardDescription>
            Sign in to your account to manage your khata and access all
            features.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Sign In Button */}
          <Button
            className="w-full bg-blue-800 text-white hover:bg-blue-900 border-none"
            onClick={handleSignIn}
          >
            Sign In
          </Button>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Powered by secure Google authentication
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
