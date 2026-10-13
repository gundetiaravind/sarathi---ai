import { useEffect, useRef, useState } from "react";

export default function VoiceRecorder({
  onRecorded,
  disabled = false,
}) {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioFile, setAudioFile] = useState(null);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  async function startRecording() {
    setError("");

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError("Audio recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const supportedTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
      ];

      const mimeType = supportedTypes.find((type) =>
        MediaRecorder.isTypeSupported(type),
      );

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const type = recorder.mimeType || "audio/webm";
        const extension = type.includes("mp4") ? "m4a" : "webm";

        const blob = new Blob(chunksRef.current, { type });

        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setRecording(false);

        if (blob.size > 0) {
          const file = new File(
            [blob],
            `sarathi-recording.${extension}`,
            { type },
          );

          const url = URL.createObjectURL(blob);

          setAudioFile(file);
          setAudioUrl(url);
        } else {
          setError("No audio was recorded. Please try again.");
        }
      };

      recorder.start();
      setRecording(true);
    } catch {
      setError("Microphone access failed. Please allow microphone permission.");
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }

  function discardRecording() {
    setAudioFile(null);
    setAudioUrl("");
    setError("");
  }

  function sendRecording() {
    if (!audioFile) return;

    onRecorded?.(audioFile);

    setAudioFile(null);
    setAudioUrl("");
    setError("");
  }

  return (
    <div className="voice-recorder">
      {!audioUrl && (
        <button
          type="button"
          className="voice-recorder-button"
          disabled={disabled}
          onClick={recording ? stopRecording : startRecording}
          aria-label={recording ? "Stop recording" : "Start recording"}
          title={recording ? "Stop recording" : "Record voice"}
        >
          {recording ? "⏹️" : "🎤"}
        </button>
      )}

      {recording && (
        <span className="voice-recorder-status">
          🔴 Recording… Click stop when finished.
        </span>
      )}

      {audioUrl && (
        <div className="voice-recording-preview">
          <div className="voice-recording-title">
            🎤 Recorded voice message
          </div>

          <audio
            className="voice-recording-audio"
            src={audioUrl}
            controls
            preload="metadata"
          />

          <div className="voice-recording-actions">
            <button
              type="button"
              onClick={discardRecording}
              disabled={disabled}
            >
              Discard
            </button>

            <button
              type="button"
              onClick={sendRecording}
              disabled={disabled}
            >
              Send voice
            </button>
          </div>
        </div>
      )}

      {error && (
        <span className="voice-recorder-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
