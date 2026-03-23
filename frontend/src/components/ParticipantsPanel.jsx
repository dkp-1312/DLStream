import { useParticipants } from "@livekit/components-react";

export default function ParticipantsPanel() {

  const participants = useParticipants();

  return (
    <div className="w-64 bg-white p-3 overflow-y-auto">

      <h3 className="font-bold mb-2">Participants</h3>

      {participants.map(p => (
        <div key={p.sid} className="p-2 border-b">
          {p.identity}
        </div>
      ))}

    </div>
  );
}