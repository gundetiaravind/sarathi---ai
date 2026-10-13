
import ImageMessage from "./ImageMessage";

export default function ChatWindow({
  messages = [],
  isSending = false,
  bottomRef,
}) {
  return (
    <div className="chat-window">
      {messages.map((message, index) => {
        const isUser =
          message.sender === "user" ||
          message.role === "user" ||
          message.from === "user";

        const text =
          message.text ?? message.content ?? message.message ?? "";

        const imageUrl =
          message.imageUrl ?? message.image ?? message.previewUrl ?? "";

        return (
          <div
            key={message.id ?? `${message.timestamp ?? "message"}-${index}`}
            className={`message-row ${isUser ? "message-row-user" : "message-row-assistant"}`}
          >
            <div className={`message-bubble ${isUser ? "message-bubble-user" : "message-bubble-assistant"}`}>
              {imageUrl && <ImageMessage src={imageUrl} />}
              {text && <div className="message-text">{text}</div>}
              {message.time && (
                <span className="message-time">{message.time}</span>
              )}
            </div>
          </div>
        );
      })}

      {isSending && (
        <div className="message-row message-row-assistant">
          <div className="message-bubble message-bubble-assistant">
            Thinking…
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
