export default function WaitingRoom({ onJoin }) {

    return (
      <div className="h-screen flex flex-col justify-center items-center">
  
        <h2 className="text-2xl mb-4">
          Waiting Room
        </h2>
  
        <button className="btn btn-primary" onClick={onJoin}>
          Join Now
        </button>
  
      </div>
    );
  }