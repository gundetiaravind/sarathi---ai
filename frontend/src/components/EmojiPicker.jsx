
import { useState } from "react";

const emojis = [
  "😀", "😂", "😊", "😍", "🥰", "😉", "😎", "😭",
  "🙏", "👍", "👎", "👏", "❤️", "💚", "🎉", "🔥",
  "🤔", "😅", "✅", "❌", "⭐", "📄", "📷", "🎤",
];

export default function EmojiPicker({ onSelect, disabled = false }) {
  const [open, setOpen] = useState(false);

  function chooseEmoji(emoji) {
    onSelect?.(emoji);
    setOpen(false);
  }

  return (
    <div className="emoji-picker-container">
      <button
        type="button"
        className="emoji-picker-toggle"
        aria-label="Choose emoji"
        title="Choose emoji"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
      >
        😊
      </button>

      {open && (
        <div className="emoji-picker-panel" role="group" aria-label="Emojis">
          
{emojis.map((emoji) => (
  <button
    type="button"
    key={emoji}
    className="emoji-option"
    onClick={() => chooseEmoji(emoji)}
    aria-label={`Insert ${emoji}`}
  >
    {emoji}
  </button>
))}

        </div>
      )}
    </div>
  );
}
