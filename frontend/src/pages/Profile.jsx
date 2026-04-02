import {Link} from "react-router";
import {useAuthContext} from "../context/AuthContext";
 
export default function Profile() {
    const {authUser} = useAuthContext();
    if(!authUser)
    {
        return <p>Loading...</p>;
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-full max-w-md bg-base-100 shadow-xl p-4">
            <h1 className="text-2xl font-bold">Profile</h1>
            <div className="mt-4">
                <p><b>Name:</b> {authUser.fullName}</p>
                <p><b>Email:</b> {authUser.email}</p>
                <p><b>Phone:</b> {authUser.phone}</p>
                <p><b>Username:</b> {authUser.username}</p>
                <p><b>Bio:</b> {authUser.bio}</p>
            </div>
            <Link to="/editProfile" className="btn btn-primary">Edit Profile</Link>
        </div></div>
    );
}