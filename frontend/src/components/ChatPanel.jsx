import PanelHeader from "./PanelHeader.jsx";
import { useSocketChat } from "../hooks/useSocketChat";

/**
 * @param {"stream" | "meeting"} mode — stream: live broadcast chat (warm). meeting: LiveKit room chat (primary).
 */
export default function ChatPanel({ mode, roomName }) {
  const {
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    messagesEndRef,
    canSend,
  } = useSocketChat(roomName);

  const stream = mode === "stream";

  const shell = stream
    ? "flex h-full min-h-0 w-full flex-col bg-gradient-to-b from-warning/[0.12] to-base-100/95"
    : "flex h-full min-h-0 w-full flex-col bg-gradient-to-b from-primary/[0.07] to-base-100/95";

  const listBg = stream ? "bg-warning/[0.05]" : "bg-primary/[0.04]";

  const emptyCopy = stream
    ? "No messages in this stream yet"
    : "No messages in this meeting yet";

  const emptyBox = stream
    ? "rounded-xl border border-dashed border-warning/35 bg-base-100/70 px-3 py-6 text-center text-sm text-base-content/50"
    : "rounded-xl border border-dashed border-primary/25 bg-base-100/70 px-3 py-6 text-center text-sm text-base-content/50";

  const cardClass = stream
    ? "rounded-xl border border-warning/25 bg-base-100/90 px-3 py-2.5 shadow-sm ring-1 ring-warning/10 transition hover:border-warning/45 hover:bg-base-100"
    : "rounded-xl border border-primary/15 bg-base-100/85 px-3 py-2.5 shadow-sm ring-1 ring-primary/10 transition hover:border-primary/30 hover:bg-base-100";

  const senderClass = stream
    ? "text-sm font-semibold text-warning"
    : "text-sm font-semibold text-primary";

  const formBorder = stream ? "border-warning/25" : "border-primary/20";
  const formGrad = stream
    ? "from-warning/12 to-base-100/90"
    : "from-primary/10 to-base-100/90";
  const inputWrap = stream
    ? "border-warning/30 bg-base-100/90 ring-warning/10 focus-within:border-warning/50 focus-within:ring-2 focus-within:ring-warning/25"
    : "border-primary/25 bg-base-100/90 ring-primary/10 focus-within:border-primary/45 focus-within:ring-2 focus-within:ring-primary/25";

  const sendBtn = stream ? "btn-warning" : "btn-primary";

  return (
    <div className={shell}>
      <PanelHeader
        variant={stream ? "stream" : "chat"}
        label={stream ? "Stream chat" : "Meeting chat"}
        subtitle={roomName}
      />

      <div
        className={`scrollbar-thin min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain px-3 py-3 ${listBg}`}
      >
        {messages.length === 0 ? (
          <p className={emptyBox}>{emptyCopy}</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={cardClass}>
              <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                <span className={senderClass}>{msg.sender}</span>
                <span className="text-xs text-base-content/45">{msg.timestamp}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-base-content">{msg.text}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className={`shrink-0 border-t ${formBorder} bg-gradient-to-t ${formGrad} px-3 py-3 backdrop-blur-sm`}
      >
        <div
          className={`flex gap-2 rounded-xl border p-1.5 shadow-inner ${inputWrap}`}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!canSend}
            className="input input-ghost min-h-9 flex-1 border-0 bg-transparent px-2 text-sm focus:outline-none disabled:opacity-50"
            placeholder={
              canSend
                ? stream
                  ? "Message the stream…"
                  : "Message the meeting…"
                : "Log in to chat"
            }
          />
          <button
            type="submit"
            disabled={!canSend}
            className={`btn btn-sm shrink-0 rounded-lg px-4 my-auto font-semibold shadow-sm ${sendBtn} disabled:btn-disabled`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
