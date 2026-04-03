import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [userOtpInput, setUserOtpInput] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = e.target.elements;

    if (password.value !== confirmPassword.value) {
      alert("Passwords do not match!");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setFormData({
      fullName: fullName.value,
      email: email.value,
      password: password.value,
    });

    try {
      await axios.post("http://localhost:3000/otp/send_otp", {
        recipient_email: email.value,
        otp: otp,
      });

      setIsOtpSent(true);
      alert("OTP sent to your email!");
    } catch (error) {
      console.error("Failed to send OTP:", error);
      alert("Error sending OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (userOtpInput === generatedOtp) {
      try {
        await axios.post("http://localhost:3000/auth/signup", formData);
        alert("Account created successfully!");
        navigate("/login");
      } catch {
        alert("Sign-up failed during account creation.");
      }
    } else {
      alert("Invalid OTP. Please check your email.");
    }
  };

  return (
    <main className="min-h-[calc(100dvh-3.5rem)] bg-base-200 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-base-300/80 bg-base-100 shadow-soft lg:flex-row">
        <div className="flex flex-1 flex-col justify-center p-8 sm:p-10 lg:max-w-md lg:flex-none xl:p-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Get started
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-base-content/65">
            {!isOtpSent
              ? "We’ll email a one-time code to verify your address."
              : `Enter the code sent to ${formData.email}`}
          </p>

          {!isOtpSent ? (
            <form onSubmit={handleInitialSubmit} className="mt-8 space-y-4">
              <label className="form-control w-full">
                <span className="label-text font-medium">Full name</span>
                <input
                  type="text"
                  name="fullName"
                  className="input input-bordered w-full border-base-300 bg-base-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text font-medium">Email</span>
                <input
                  type="email"
                  name="email"
                  className="input input-bordered w-full border-base-300 bg-base-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text font-medium">Password</span>
                <input
                  type="password"
                  name="password"
                  className="input input-bordered w-full border-base-300 bg-base-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text font-medium">Confirm password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  className="input input-bordered w-full border-base-300 bg-base-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </label>
              <button
                type="submit"
                className="btn btn-primary mt-2 w-full font-semibold shadow-sm"
              >
                Send verification code
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="mt-8 space-y-5">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={userOtpInput}
                onChange={(e) => setUserOtpInput(e.target.value)}
                className="input input-bordered w-full border-base-300 bg-base-100 text-center font-mono text-2xl tracking-[0.4em] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="••••••"
                required
                aria-label="One-time code"
              />
              <button
                type="submit"
                className="btn btn-primary w-full font-semibold shadow-sm"
              >
                Verify &amp; sign up
              </button>
              <button
                type="button"
                onClick={() => setIsOtpSent(false)}
                className="btn btn-ghost btn-sm w-full font-medium text-base-content/70"
              >
                Use a different email
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-base-content/65">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="relative hidden min-h-[280px] flex-1 bg-gradient-to-br from-accent/15 via-base-200 to-primary/20 lg:block">
          <img
            src="/SignUp.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
