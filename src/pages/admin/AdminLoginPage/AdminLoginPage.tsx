import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import LoginForm from "../../../organisms/LoginForm";
import { loginAdmin, validateToken } from "../../../services/authService";
import { getPushSubscription } from "../../../services/pushNotificationService";
import PageLoader from "../../../atoms/PageLoader";

const AdminLoginPage = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(() =>
    Boolean(localStorage.getItem("token")),
  );

  useEffect(() => {
    if (!localStorage.getItem("token")) return;

    validateToken()
      .then(({ valid, role }) => {
        if (valid && role && role === "admin") {
          navigate(`/${role}/dashboard`, { replace: true });
        } else {
          localStorage.clear();
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => {
        setCheckingToken(false);
      });
  }, [navigate]);

  if (checkingToken) {
    return <PageLoader />;
  }

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const pushSubscription = await getPushSubscription();

      const data = await loginAdmin({
        email,
        password,
        ...(pushSubscription ? { pushSubscription } : {}),
      });

      if (!data.token) {
        setError(
          "Login successful, but authentication token was not received.",
        );
        return;
      }

      localStorage.clear();

      // Save admin JWT
      localStorage.setItem("token", data.token);

      if (data.name) {
        localStorage.setItem("name", data.name);
      }

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin login error:", error);

      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background text-primary">
      <div className="flex min-h-dvh items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div
              className="
                mx-auto
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-primary
                text-white
                shadow-sm
              "
            >
              <ShieldCheck className="h-8 w-8" />
            </div>

            <h1 className="text-2xl font-bold text-ink md:text-3xl">
              Admin Portal
            </h1>

            <p className="mt-2 text-sm text-muted">
              Login to manage your platform
            </p>
          </div>

          {/* Login Card */}
          <div
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              md:p-8
            "
          >
            <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-muted">
            Blue Eye Electric Services
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
