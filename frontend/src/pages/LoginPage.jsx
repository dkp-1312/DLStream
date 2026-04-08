import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { login, googleLogin } from "../services/api";
import { auth } from "../firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

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
      console.log(response);
      setAuthUser(response.user);
      localStorage.setItem("authUser", JSON.stringify(response.user));
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        email: user.email,
        fullName: user.displayName,
        profilePic: user.photoURL,
      };
      
      const response = await googleLogin(userData);
      console.log(response);
      
      setAuthUser(response.user);
      localStorage.setItem("authUser", JSON.stringify(response.user));
      navigate("/");
    } catch (error) {
      console.error("Error during Google login:", error.response?.data || error.message);
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

          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-base-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-base-100 px-2 text-sm text-base-content/60">Or continue with</span>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleGoogleLogin}
              className="btn btn-outline btn-primary w-full font-semibold shadow-sm flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              Sign in with Google
            </button>
          </div>
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
