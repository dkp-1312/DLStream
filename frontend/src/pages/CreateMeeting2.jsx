import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

export default function CreateMeeting1(){

  const navigate = useNavigate();

  const createMeeting = ()=>{
    const id = uuidv4();
    navigate(`/meeting/${id}`);
  }

  return(
    <div>

      <h2>Create Video Meeting</h2>

      <button onClick={createMeeting}>
        Start Meeting
      </button>

    </div>
  )
}