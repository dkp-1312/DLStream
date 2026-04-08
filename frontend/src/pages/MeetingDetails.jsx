import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
export default function MeetingDetails() {
  const { meetingId } = useParams();
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await API.get(`/meeting/${meetingId}`);
        setMeeting(res.data);
      } catch (err) {
        if (err.response?.status === 403) {
          toast.error("You are not the owner of this meeting. Access denied.");
          navigate("/meetings");
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [meetingId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!meeting) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white">
      
      <div className="card bg-base-100 shadow-xl border">
        <div className="card-body">

          <h2 className="card-title text-2xl">
            {meeting.meetingName}
          </h2>

          <div className="divider"></div>

          <p>
            <span className="font-semibold">Meeting Date:</span>{" "}
            {new Date(meeting.meetingDate).toLocaleString()}
          </p>

          <div className="divider">Invitations</div>

          {meeting.invitations.length === 0 ? (
            <p className="text-gray-500">No invitations sent.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {meeting.invitations.map((inv, index) => (
                    <tr key={index}>
                      <td>{inv.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            inv.status === "accepted"
                              ? "badge-success"
                              : inv.status === "declined"
                              ? "badge-error"
                              : "badge-warning"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

          <div className="card-actions justify-end mt-4">
            <button
              className="btn btn-outline"
              onClick={() => navigate("/meetings")}
            >
              Back
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}