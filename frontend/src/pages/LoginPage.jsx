import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { login } from "../services/api";

const LoginPage = () => {
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const credentials = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const response = await login(credentials);
      setAuthUser(response.user);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  return (
    <main className="min-h-[calc(100dvh-3.5rem)] bg-base-200 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-base-300/80 bg-base-100 shadow-soft lg:flex-row">
        <div className="flex flex-1 flex-col justify-center p-8 sm:p-10 lg:max-w-md lg:flex-none xl:p-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Welcome back
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
            Sign in to DL Stream
          </h1>
          <p className="mt-2 text-sm text-base-content/65">
            Use your account to access meetings and streams.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <label className="form-control w-full">
              <span className="label-text font-medium">Email</span>
              <input
                type="email"
                id="email"
                name="email"
                className="input input-bordered w-full border-base-300 bg-base-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text font-medium">Password</span>
              <input
                type="password"
                id="password"
                name="password"
                className="input input-bordered w-full border-base-300 bg-base-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary mt-2 w-full font-semibold shadow-sm"
            >
              Sign in
            </button>
            <p className="text-center text-sm text-base-content/65">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="font-semibold text-primary hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>

        <div className="relative hidden min-h-[280px] flex-1 bg-gradient-to-br from-primary/20 via-base-200 to-accent/15 lg:block">
          <img
            src="/Login.png"
            alt=""
            className="absolute inset-0 h-full w-full object-contain p-8"
          />
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
