import { useState } from "react";
import type { FormEvent } from "react";
import { LockKeyhole, Mail } from "lucide-react";

import { PrimaryButton } from "../../atoms";

type LoginFormProps = {
  onSubmit: (data: { email: string; password: string }) => void | Promise<void>;

  loading?: boolean;
  error?: string;
};

const LoginForm = ({
  onSubmit,
  loading = false,
  error = "",
}: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit({
      email,
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-ink"
        >
          Email Address
        </label>

        <div className="relative">
          <Mail
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-muted
            "
          />

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            autoComplete="email"
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              py-3
              pl-11
              pr-4
              text-sm
              text-ink
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-primary
              focus:bg-white
              focus:ring-2
              focus:ring-primary/10
            "
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-ink"
        >
          Password
        </label>

        <div className="relative">
          <LockKeyhole
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-muted
            "
          />

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              py-3
              pl-11
              pr-4
              text-sm
              text-ink
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-primary
              focus:bg-white
              focus:ring-2
              focus:ring-primary/10
            "
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="
            rounded-xl
            border
            border-red-100
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-600
          "
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <PrimaryButton fullWidth type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </PrimaryButton>
    </form>
  );
};

export default LoginForm;
