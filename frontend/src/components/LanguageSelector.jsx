
const languages = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
  { value: "te", label: "తెలుగు" },
];

export default function LanguageSelector({
  value = "en",
  onChange,
  disabled = false,
}) {
  return (
    <select
      className="language-selector"
      aria-label="Chat language"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange?.(event.target.value)}
    >
      {languages.map((language) => (
        <option key={language.value} value={language.value}>
          {language.label}
        </option>
      ))}
    </select>
  );
}
