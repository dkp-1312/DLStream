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
        <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-100">
            <div className="flex w-full max-w-5xl flex-col lg:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
           
                <div className="w-full lg:w-1/2 p-8">
                    <h2 className="text-2xl font-bold mb-2 text-sky-700">DL Stream</h2>
                    <p className="text-sm text-accent-600 text-sky-500 mb-6">Login to Your Account</p>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="input input-bordered input-accent bg-white w-full mt-1"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="input input-bordered bg-white input-accent w-full mt-1"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-secondary w-full"
                        >
                            Login
                        </button>
                        <p className="text-center text-sm text-gray-600 mt-4">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-sky-500 hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </div>

                <div className="hidden lg:block lg:w-1/2">
                    <img
                        src="/Login.png"
                        alt="Login"
                        className="object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;