export default function WaitingRoom({ onJoin }) {
  return (
    <main className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center bg-base-200 px-4 py-12">
      <div className="w-full max-w-md animate-fade-in rounded-2xl border border-base-300/80 bg-base-100 p-8 text-center shadow-soft sm:p-10">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
          🎧
        </div>
        <h1 className="text-xl font-bold tracking-tight text-base-content sm:text-2xl">
          Ready to join?
        </h1>
        <p className="mt-2 text-sm text-base-content/65">
          You&apos;ll connect with your camera and mic when the host allows, or as a viewer if the session is set up that way.
        </p>
        <button
          type="button"
          className="btn btn-primary btn-wide mt-8 font-semibold shadow-sm"
          onClick={onJoin}
        >
          Join now
        </button>
      </div>
    </main>
  );
}
