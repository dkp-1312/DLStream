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
                otp: otp
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
                const response = await axios.post("http://localhost:3000/auth/signup", formData);
                alert("Account created successfully!");
                navigate("/login");
            } catch (error) {
                alert("Sign-up failed during account creation.");
            }
        } else {
            alert("Invalid OTP. Please check your email.");
        }
    };

    return (
        <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-100" data-theme="winter">
            <div className="flex w-full max-w-5xl flex-col lg:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="w-full lg:w-1/2 p-8">
                    <h2 className="text-2xl font-bold mb-2 text-sky-700">DL Stream</h2>
                    
                    {!isOtpSent ? (
                        <>
                            <p className="text-sm text-sky-500 mb-6">Create an Account</p>
                            <form onSubmit={handleInitialSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" name="fullName" className="input input-bordered input-accent bg-white w-full" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" name="email" className="input input-bordered input-accent bg-white w-full" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input type="password" name="password" className="input input-bordered input-accent bg-white w-full" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                    <input type="password" name="confirmPassword" className="input input-bordered input-accent bg-white w-full" required />
                                </div>
                                <button type="submit" className="btn btn-secondary w-full">Send OTP</button>
                            </form>
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-sky-500 mb-6">Verify your Email</p>
                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <p className="text-gray-600">Enter the 6-digit code sent to <strong>{formData.email}</strong></p>
                                <input
                                    type="text"
                                    maxLength="6"
                                    value={userOtpInput}
                                    onChange={(e) => setUserOtpInput(e.target.value)}
                                    className="input input-bordered input-accent bg-white w-full text-center text-2xl tracking-widest"
                                    placeholder="000000"
                                    required
                                />
                                <button type="submit" className="btn btn-primary w-full">Verify & Sign Up</button>
                                <button type="button" onClick={() => setIsOtpSent(false)} className="text-sm text-gray-500 underline w-full">
                                    Change Email 
                                </button>
                            </form>
                        </>
                    )}

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already have an account? <Link to="/login" className="text-sky-500 hover:underline">Login</Link>
                    </p>
                </div>
                
                <div className="hidden lg:block lg:w-1/2">
                    <img src="/SignUp.png" alt="Sign Up" className="w-full h-full object-cover" />
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;