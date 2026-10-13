
import { useCallback, useEffect, useRef, useState } from "react";
import {
  checkBackendHealth,
  checkAIHealth,
  sendChatMessage,
  scanImage,
  scanPdf,
  transcribeAudio,
  saveConversation,
} from "./services/api";
import "./App.css";

const STORAGE_KEY = "sarathi-ai-single-chat-v1";
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
  { value: "te", label: "తెలుగు" },
];

const COPY = {
  en: {
    subtitle: "Your application and form-filling assistant",
    newChat: "New Chat",
    welcome: "Hi! I'm Sarathi AI.",
    welcomeText: "How can I help you today?",
    formHelp: "Ask about an application, upload a form, or record your question. I can explain form fields, provide sample answers, list required documents, and guide you through the next steps.",
    placeholder: "Message Sarathi AI...",
    send: "Send",
    image: "Photo or image",
    pdf: "PDF document",
    recording: "Recording…",
    startRecord: "Record voice",
    stopRecord: "Stop recording",
    thinking: "Sarathi is thinking…",
    error: "Sorry, something went wrong.",
    backend: "Java backend",
    ai: "Local AI",
    online: "Connected",
    offline: "Offline",
    attachmentReady: "File ready",
    reading: "Reading document…",
    readFailed: "Could not extract text from this file.",
    waitAudio: "Please wait until audio processing finishes.",
    discard: "Discard recording",
    recognized: "Recognized speech",
    today: "Today",
    disclaimer: "Sarathi AI can make mistakes. Verify official requirements before submitting an application.",
    start: "Start Chat",
    clearConfirm: "Start a new chat? The current conversation will be cleared.",
    noText: "No readable text was found. Try a clearer image or higher-quality scan.",
  },
  hi: {
    subtitle: "आवेदन और फ़ॉर्म भरने में आपकी सहायता",
    newChat: "नई चैट",
    welcome: "नमस्ते! मैं Sarathi AI हूँ।",
    welcomeText: "आज मैं आपकी कैसे मदद कर सकता हूँ?",
    formHelp: "आवेदन के बारे में पूछें, फ़ॉर्म अपलोड करें या अपना सवाल रिकॉर्ड करें। मैं फ़ील्ड समझा सकता हूँ, उदाहरण दे सकता हूँ, आवश्यक दस्तावेज़ बता सकता हूँ और अगले चरणों में मदद कर सकता हूँ।",
    placeholder: "Sarathi AI को संदेश लिखें...",
    send: "भेजें",
    image: "फ़ोटो या इमेज",
    pdf: "PDF दस्तावेज़",
    recording: "रिकॉर्डिंग जारी है…",
    startRecord: "आवाज़ रिकॉर्ड करें",
    stopRecord: "रिकॉर्डिंग रोकें",
    thinking: "Sarathi सोच रहा है…",
    error: "क्षमा करें, कुछ गलत हुआ।",
    backend: "Java बैकएंड",
    ai: "लोकल AI",
    online: "कनेक्टेड",
    offline: "ऑफ़लाइन",
    attachmentReady: "फ़ाइल तैयार है",
    reading: "दस्तावेज़ पढ़ा जा रहा है…",
    readFailed: "इस फ़ाइल से टेक्स्ट नहीं निकाला जा सका।",
    waitAudio: "ऑडियो प्रोसेसिंग पूरी होने तक प्रतीक्षा करें।",
    discard: "रिकॉर्डिंग हटाएँ",
    recognized: "पहचाने गए शब्द",
    today: "आज",
    disclaimer: "Sarathi AI से गलती हो सकती है। आवेदन जमा करने से पहले आधिकारिक आवश्यकताओं की जाँच करें।",
    start: "चैट शुरू करें",
    clearConfirm: "नई चैट शुरू करें? वर्तमान बातचीत साफ़ हो जाएगी।",
    noText: "पढ़ने योग्य टेक्स्ट नहीं मिला। साफ़ इमेज या बेहतर स्कैन आज़माएँ।",
  },
  te: {
    subtitle: "దరఖాస్తులు మరియు ఫారమ్‌లను పూరించడానికి సహాయం",
    newChat: "కొత్త చాట్",
    welcome: "నమస్కారం! నేను Sarathi AI.",
    welcomeText: "ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?",
    formHelp: "దరఖాస్తు గురించి అడగండి, ఫారమ్ అప్‌లోడ్ చేయండి లేదా మీ ప్రశ్నను రికార్డ్ చేయండి. ఫీల్డ్‌లను వివరించడం, ఉదాహరణలు ఇవ్వడం, అవసరమైన పత్రాలు చెప్పడం, తదుపరి దశల్లో సహాయం చేయగలను.",
    placeholder: "Sarathi AIకి సందేశం పంపండి...",
    send: "పంపు",
    image: "ఫోటో లేదా చిత్రం",
    pdf: "PDF పత్రం",
    recording: "రికార్డింగ్ జరుగుతోంది…",
    startRecord: "వాయిస్ రికార్డ్ చేయండి",
    stopRecord: "రికార్డింగ్ ఆపండి",
    thinking: "Sarathi ఆలోచిస్తోంది…",
    error: "క్షమించండి, ఏదో తప్పు జరిగింది.",
    backend: "Java బ్యాకెండ్",
    ai: "లోకల్ AI",
    online: "కనెక్ట్ అయింది",
    offline: "ఆఫ్‌లైన్",
    attachmentReady: "ఫైల్ సిద్ధంగా ఉంది",
    reading: "పత్రాన్ని చదువుతోంది…",
    readFailed: "ఈ ఫైల్ నుంచి టెక్స్ట్ తీసుకోలేకపోయాం.",
    waitAudio: "ఆడియో ప్రాసెసింగ్ పూర్తయ్యే వరకు వేచి ఉండండి.",
    discard: "రికార్డింగ్ తొలగించండి",
    recognized: "గుర్తించిన మాటలు",
    today: "ఈ రోజు",
    disclaimer: "Sarathi AIలో తప్పులు ఉండవచ్చు. దరఖాస్తు సమర్పించే ముందు అధికారిక అవసరాలను తనిఖీ చేయండి.",
    start: "చాట్ ప్రారంభించండి",
    clearConfirm: "కొత్త చాట్ ప్రారంభించాలా? ప్రస్తుత సంభాషణ తొలగించబడుతుంది.",
    noText: "చదవగలిగే టెక్స్ట్ దొరకలేదు. స్పష్టమైన చిత్రం లేదా మెరుగైన స్కాన్ ప్రయత్నించండి.",
  },
};

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function makeWelcome(language) {
  const t = COPY[language] || COPY.en;
  return {
    id: makeId(),
    role: "assistant",
    content: `${t.welcome}\n\n${t.welcomeText}\n\n${t.formHelp}`,
    time: new Date().toISOString(),
  };
}

function loadSavedChat() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && Array.isArray(saved.messages)) return saved;
  } catch {
    // Start with a clean chat if saved data is invalid.
  }
  return null;
}

function formatTime(value) {
  try {
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function errorText(error, fallback) {
  return error instanceof Error ? error.message : fallback;
}

export default function App() {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("sarathi-language") || "en"
  );
  const t = COPY[language] || COPY.en;

  const [chat, setChat] = useState(loadSavedChat);
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [aiOnline, setAiOnline] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const menuRef = useRef(null);
  const chatRef = useRef(chat);
  const busyRef = useRef(false);

  const messages = chat?.messages || [];

  useEffect(() => {
    chatRef.current = chat;
    try {
      if (chat) localStorage.setItem(STORAGE_KEY, JSON.stringify(chat));
      else localStorage.removeItem(STORAGE_KEY);
    } catch (storageError) {
      console.warn("Could not save the current Sarathi chat.", storageError);
    }
  }, [chat]);

  useEffect(() => {
    localStorage.setItem("sarathi-language", language);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    let cancelled = false;

    async function checkServices() {
      try {
        await checkBackendHealth();
        if (!cancelled) setBackendOnline(true);
      } catch {
        if (!cancelled) setBackendOnline(false);
      }

      try {
        await checkAIHealth();
        if (!cancelled) setAiOnline(true);
      } catch {
        if (!cancelled) setAiOnline(false);
      }
    }

    checkServices();
    const interval = window.setInterval(checkServices, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    function closeMenu(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  useEffect(() => () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const discardRecording = useCallback(() => {
    setRecordedAudio((current) => {
      if (current?.previewUrl) URL.revokeObjectURL(current.previewUrl);
      return null;
    });
  }, []);

  const startNewChat = () => {
    if (busyRef.current) return;

    if (chatRef.current?.messages?.some((message) => message.role === "user")) {
      if (!window.confirm(t.clearConfirm)) return;
    }

    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
    setAttachment(null);
    discardRecording();
    setDraft("");
    setError("");
    setMenuOpen(false);

    const newChat = {
      id: makeId(),
      title: "Sarathi AI chat",
      time: new Date().toISOString(),
      messages: [makeWelcome(language)],
    };

    chatRef.current = newChat;
    setChat(newChat);
  };

  const selectFile = async (file, type) => {
    if (!file) return;

    setMenuOpen(false);
    setError("");

    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);

    const previewUrl = type === "image" ? URL.createObjectURL(file) : "";
    setAttachment({
      name: file.name,
      type,
      status: "reading",
      text: "",
      file,
      previewUrl,
    });

    try {
      const result = type === "image" ? await scanImage(file) : await scanPdf(file);
      const extractedText =
        result?.text || result?.extractedText || result?.content || "";

      setAttachment((current) =>
        current?.file !== file
          ? current
          : {
              ...current,
              status: "ready",
              text: extractedText,
              scannedPdf: Boolean(result?.scannedPdf),
            }
      );

      if (!extractedText.trim()) setError(t.noText);
    } catch (scanError) {
      setAttachment((current) =>
        current?.file !== file
          ? current
          : { ...current, status: "failed", text: "" }
      );
      setError(errorText(scanError, t.readFailed));
    }
  };

  const clearAttachment = () => {
    setAttachment((current) => {
      if (current?.previewUrl) URL.revokeObjectURL(current.previewUrl);
      return null;
    });
  };

  const startRecording = async () => {
    setError("");

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError("Voice recording is not supported by this browser.");
      return;
    }

    if (recordedAudio) discardRecording();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const supportedTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
      ];
      const mimeType = supportedTypes.find((type) =>
        MediaRecorder.isTypeSupported(type)
      );
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.onerror = () => {
        setError("Recording failed. Please try again.");
        setRecording(false);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setRecording(false);

        const type = recorder.mimeType || "audio/webm";
        const extension = type.includes("mp4") ? "m4a" : "webm";
        const blob = new Blob(audioChunksRef.current, { type });
        audioChunksRef.current = [];

        if (!blob.size) {
          setError("No audio was recorded. Please try again.");
          return;
        }

        const file = new File([blob], `sarathi-recording.${extension}`, { type });
        const previewUrl = URL.createObjectURL(blob);

        setRecordedAudio({
          file,
          previewUrl,
          dataUrl: "",
          transcript: "",
          status: "transcribing",
          transcriptionError: "",
        });

        busyRef.current = true;
        setBusy(true);

        try {
          const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () =>
              reject(new Error("Could not prepare the audio for saving."));
            reader.readAsDataURL(blob);
          });

          let transcript = "";
          let transcriptionError = "";

          try {
            const result = await transcribeAudio(file, language);
            transcript = (
              result?.text ||
              result?.transcript ||
              result?.transcription ||
              ""
            ).trim();
          } catch (transcribeError) {
            transcriptionError = errorText(
              transcribeError,
              "Audio transcription failed."
            );
          }

          setRecordedAudio((current) =>
            current?.file !== file
              ? current
              : {
                  ...current,
                  dataUrl,
                  transcript,
                  status: transcript ? "ready" : "failed",
                  transcriptionError,
                }
          );

          if (!transcript && transcriptionError) {
            setError(`Audio recorded, but transcription failed: ${transcriptionError}`);
          } else if (!transcript) {
            setError("Audio recorded, but no speech was detected. You can still send it.");
          }
        } catch (recordError) {
          setRecordedAudio((current) =>
            current?.file !== file
              ? current
              : {
                  ...current,
                  status: "ready",
                  transcriptionError: errorText(recordError, t.error),
                }
          );
          setError(errorText(recordError, t.error));
        } finally {
          busyRef.current = false;
          setBusy(false);
        }
      };

      recorder.start();
      setRecording(true);
    } catch (recordError) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setError(errorText(recordError, "Microphone access failed. Allow microphone permission."));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const sendMessage = async (event) => {
    event?.preventDefault();

    const text = draft.trim();
    const audioToSend = recordedAudio;
    const attachmentToSend = attachment;

    if (busyRef.current || (!text && !attachmentToSend && !audioToSend)) return;

    if (audioToSend?.status === "transcribing") {
      setError(t.waitAudio);
      return;
    }

    setError("");

    const currentChat = chatRef.current || {
      id: makeId(),
      title: "Sarathi AI chat",
      time: new Date().toISOString(),
      messages: [makeWelcome(language)],
    };

    const attachmentContext = attachmentToSend
      ? [
          `Attached file: ${attachmentToSend.name}`,
          `Attachment type: ${attachmentToSend.type}`,
          attachmentToSend.status === "failed"
            ? "Text extraction failed. Ask the user to upload a clearer copy if needed."
            : "",
          attachmentToSend.text
            ? `Extracted document text:\n${attachmentToSend.text.slice(0, 30000)}`
            : "",
        ]
          .filter(Boolean)
          .join("\n\n")
      : "";

    const voiceContext = audioToSend?.transcript
      ? `Recorded voice transcript:\n${audioToSend.transcript}`
      : "";

    const userMessage = {
      id: makeId(),
      role: "user",
      content: [
        text,
        attachmentToSend ? `📎 ${attachmentToSend.name}` : "",
        audioToSend?.transcript
          ? `🎤 ${audioToSend.transcript}`
          : audioToSend
            ? "🎤 Voice message"
            : "",
      ]
        .filter(Boolean)
        .join("\n"),
      time: new Date().toISOString(),
      attachmentName: attachmentToSend?.name || "",
      attachmentType: attachmentToSend?.type || "",
      audioDataUrl: audioToSend?.dataUrl || "",
      audioName: audioToSend?.file?.name || "",
      audioTranscript: audioToSend?.transcript || "",
    };

    const updatedMessages = [...currentChat.messages, userMessage];
    const updatedChat = {
      ...currentChat,
      time: new Date().toISOString(),
      messages: updatedMessages,
    };

    chatRef.current = updatedChat;
    setChat(updatedChat);
    setDraft("");

    if (attachmentToSend?.previewUrl) URL.revokeObjectURL(attachmentToSend.previewUrl);
    setAttachment(null);
    discardRecording();

    busyRef.current = true;
    setBusy(true);


const currentMessages = currentChat.messages || [];

const conversationHistory = currentMessages
  .filter(
    (message) =>
      (message.role === "user" || message.role === "assistant") &&
      message.content?.trim()
  )
  .slice(-12)
  .map((message) =>
    `${message.role === "user" ? "User" : "Sarathi AI"}: ${message.content}`
  )
  .join("\n\n");

const languageRule =
  language === "hi"
    ? "You MUST answer entirely in Hindi using Devanagari script. Translate all explanations, questions, headings, examples, and instructions into Hindi. Do not answer in English or Telugu, except for proper names and necessary official terms."
    : language === "te"
      ? "You MUST answer entirely in Telugu using Telugu script. Translate all explanations, questions, headings, examples, and instructions into Telugu. Do not answer in English or Hindi, except for proper names and necessary official terms."
      : "Answer entirely in English.";

const prompt = [
  "You are Sarathi AI, a practical application and form-filling assistant.",
  `MANDATORY RESPONSE LANGUAGE: ${languageRule}`,
  "The language selected in the application takes priority over the language of the user's message and previous conversation.",
  "Before sending your response, check that the entire answer follows the selected language.",
  "Help users complete applications and forms instead of merely summarizing documents.",
  "Explain the form fields simply and guide the user one field at a time.",
  "Ask only one new question per response when collecting information.",
  "Remember the information the user has already provided. Do not ask for it again unnecessarily.",
  "Give clearly labelled examples when useful. Never present example details as the user's actual information.",
  "Explain supporting documents and next steps. Do not invent official requirements, eligibility rules, deadlines, fees, or personal information.",
  conversationHistory
    ? `Previous conversation for context only:\n${conversationHistory}`
    : "This is the beginning of the conversation.",
  text
    ? `Latest user question:\n${text}`
    : "The user supplied an attachment or voice message. Help them understand what to do next.",
  attachmentContext
    ? `Attached document context:\n${attachmentContext}`
    : "",
  voiceContext,
].filter(Boolean).join("\n\n");



    try {
      const result = await sendChatMessage(prompt, language);
      const reply = result?.reply || result?.response || result?.message || "";

      if (!reply.trim()) throw new Error("The AI returned an empty response.");

      const assistantMessage = {
        id: makeId(),
        role: "assistant",
        content: reply,
        time: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      const finalChat = {
        ...updatedChat,
        title: "Sarathi AI chat",
        time: new Date().toISOString(),
        messages: finalMessages,
      };

      chatRef.current = finalChat;
      setChat(finalChat);

      try {
        await saveConversation(finalChat);
      } catch {
        // The single current conversation is still saved locally.
      }
    } catch (chatError) {
      const assistantMessage = {
        id: makeId(),
        role: "assistant",
        content: `${t.error}\n\n${errorText(chatError, "Check that the local AI service is running.")}`,
        time: new Date().toISOString(),
      };

      const failedChat = {
        ...updatedChat,
        messages: [...updatedMessages, assistantMessage],
        time: new Date().toISOString(),
      };

      chatRef.current = failedChat;
      setChat(failedChat);
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  const handleComposerKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="sarathi-app single-chat-app">
      <section className="chat-panel">
        <header className="chat-header">
          <div className="header-avatar">S</div>

          <div className="header-details">
            <div className="header-title">Sarathi AI</div>
            <div className="header-subtitle">{t.subtitle}</div>
            <div className="header-status">
              <span className={`status-dot ${backendOnline ? "online" : ""}`} />
              <span>{t.backend}: {backendOnline ? t.online : t.offline}</span>
              <span className={`status-dot ${aiOnline ? "online" : ""}`} />
              <span>{t.ai}: {aiOnline ? t.online : t.offline}</span>
            </div>
          </div>

          <label className="language-picker">
            <span className="sr-only">Language</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              aria-label="Choose language"
            >
              {LANGUAGES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="header-new-chat"
            onClick={startNewChat}
            disabled={busy || recording}
          >
            <span aria-hidden="true">＋</span>
            <span>{t.newChat}</span>
          </button>
        </header>

        <div className="messages-area">
          {!chat ? (
            <div className="welcome-screen">
              <div className="welcome-logo">S</div>
              <h1>{t.welcome}</h1>
              <p>{t.welcomeText}</p>
              <div className="welcome-suggestion">
                <span className="suggestion-icon">✓</span>
                <span>{t.formHelp}</span>
              </div>
              <button className="welcome-start" onClick={startNewChat}>
                {t.start}
              </button>
            </div>
          ) : (
            <>
              <div className="date-divider"><span>{t.today}</span></div>

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message-row ${message.role === "user" ? "user-row" : "assistant-row"}`}
                >
                  {message.role === "assistant" && (
                    <div className="message-avatar">S</div>
                  )}

                  <div className={`message-bubble ${message.role === "user" ? "user-bubble" : "assistant-bubble"}`}>
                    {message.attachmentName && (
                      <div className="message-attachment">
                        <span className="attachment-symbol">
                          {message.attachmentType === "image" ? "▧" : "▤"}
                        </span>
                        <span>{message.attachmentName}</span>
                      </div>
                    )}

                    {message.audioDataUrl && (
                      <div className="chat-audio-message">
                        <div className="chat-audio-label">
                          🎤 {message.audioName || "Voice message"}
                        </div>
                        <audio controls preload="metadata" src={message.audioDataUrl} />
                        {message.audioTranscript && (
                          <details className="chat-audio-transcript">
                            <summary>{t.recognized}</summary>
                            <p>{message.audioTranscript}</p>
                          </details>
                        )}
                      </div>
                    )}

                    <div className="message-content">{message.content}</div>
                    <div className="message-time">
                      {formatTime(message.time)}
                      {message.role === "user" && <span className="message-check">✓✓</span>}
                    </div>
                  </div>
                </div>
              ))}

              {busy && (
                <div className="message-row assistant-row">
                  <div className="message-avatar">S</div>
                  <div className="typing-bubble">
                    <span /><span /><span />
                    <small>{t.thinking}</small>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button onClick={() => setError("")} aria-label="Dismiss error">×</button>
          </div>
        )}

        <form className="composer-wrap" onSubmit={sendMessage}>
          {attachment && (
            <div className="attachment-preview">
              {attachment.previewUrl && (
                <img src={attachment.previewUrl} alt="Selected attachment" />
              )}
              <div className="attachment-preview-info">
                <strong>{attachment.name}</strong>
                <span>
                  {attachment.status === "reading"
                    ? t.reading
                    : attachment.status === "failed"
                      ? t.readFailed
                      : t.attachmentReady}
                </span>
              </div>
              <button
                type="button"
                className="remove-attachment"
                onClick={clearAttachment}
                aria-label="Remove attachment"
              >×</button>
            </div>
          )}

          {recordedAudio && (
            <div className="recorded-audio-preview">
              <div className="recorded-audio-heading">
                🎤 {recordedAudio.file?.name || "Recorded voice message"}
              </div>
              <audio controls preload="metadata" src={recordedAudio.previewUrl} />
              {recordedAudio.status === "transcribing" && <p>{t.thinking}</p>}
              {recordedAudio.transcript && (
                <div className="recorded-transcript">
                  <strong>{t.recognized}:</strong>
                  <p>{recordedAudio.transcript}</p>
                </div>
              )}
              {recordedAudio.transcriptionError && <p>{recordedAudio.transcriptionError}</p>}
              <button
                type="button"
                className="remove-attachment"
                onClick={discardRecording}
                disabled={busy}
              >{t.discard}</button>
            </div>
          )}

          {recording && (
            <div className="recording-banner">
              <span className="recording-dot" />
              {t.recording}
              <button type="button" onClick={stopRecording}>{t.stopRecord}</button>
            </div>
          )}

          <div className="composer">
            <div className="attachment-menu-wrap" ref={menuRef}>
              <button
                type="button"
                className={`composer-icon-button plus-button ${menuOpen ? "selected" : ""}`}
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Add attachment"
                title="Add attachment"
                disabled={busy || recording}
              >＋</button>

              {menuOpen && (
                <div className="attachment-menu">
                  <button type="button" onClick={() => imageInputRef.current?.click()}>
                    <span className="menu-icon image-menu-icon">▧</span>
                    <span>{t.image}</span>
                  </button>
                  <button type="button" onClick={() => pdfInputRef.current?.click()}>
                    <span className="menu-icon pdf-menu-icon">▤</span>
                    <span>{t.pdf}</span>
                  </button>
                </div>
              )}
            </div>

            <input
              ref={imageInputRef}
              className="hidden-file-input"
              type="file"
              accept="image/*"
              onChange={(event) => {
                selectFile(event.target.files?.[0], "image");
                event.target.value = "";
              }}
            />

            <input
              ref={pdfInputRef}
              className="hidden-file-input"
              type="file"
              accept=".pdf,application/pdf"
              onChange={(event) => {
                selectFile(event.target.files?.[0], "pdf");
                event.target.value = "";
              }}
            />

            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              placeholder={t.placeholder}
              rows={1}
              aria-label={t.placeholder}
              disabled={busy || recording}
            />

            <button
              type="button"
              className={`composer-icon-button mic-button ${recording ? "recording-active" : ""}`}
              onClick={recording ? stopRecording : startRecording}
              disabled={busy}
              title={recording ? t.stopRecord : t.startRecord}
              aria-label={recording ? t.stopRecord : t.startRecord}
            >{recording ? "■" : "🎙"}</button>

            <button
              type="submit"
              className="send-button"
              disabled={busy || recording || (!draft.trim() && !attachment && !recordedAudio)}
              aria-label={t.send}
              title={t.send}
            ><span>➤</span></button>
          </div>

          <div className="composer-disclaimer">{t.disclaimer}</div>
        </form>
      </section>
    </main>
  );
}
