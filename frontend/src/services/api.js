const BACKEND_BASE_URL = "/api";
const AI_BASE_URL =
  "https://peripherals-ends-worth-cables.trycloudflare.com/api";

const LOCAL_CONVERSATIONS_KEY = "sarathi-ai-conversations-v2";

async function parseResponse(response) {
  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail || data.message || `Request failed: ${response.status}`
    );
  }

  return data;
}

function useLocalConversationStorage() {
  return (
    typeof window !== "undefined" &&
    window.location.hostname === "gundetiaravind.github.io"
  );
}

function readLocalConversations() {
  try {
    return JSON.parse(
      localStorage.getItem(LOCAL_CONVERSATIONS_KEY) || "[]"
    );
  } catch {
    return [];
  }
}

function writeLocalConversations(conversations) {
  localStorage.setItem(
    LOCAL_CONVERSATIONS_KEY,
    JSON.stringify(conversations)
  );
}

// Java backend health; static hosting has no Java backend.
export async function checkBackendHealth() {
  if (useLocalConversationStorage()) {
    return {
      application: "Sarathi AI",
      status: "UNAVAILABLE",
      message: "Java backend is not configured for GitHub Pages.",
    };
  }

  const response = await fetch(`${BACKEND_BASE_URL}/health`);
  return parseResponse(response);
}

// Python AI health
export async function checkAIHealth() {
  const response = await fetch(`${AI_BASE_URL}/health`);
  return parseResponse(response);
}

// Chat
export async function sendChatMessage(message, language = "auto") {
  const response = await fetch(`${AI_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, language }),
  });

  return parseResponse(response);
}

// Image scanning
export async function scanImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${AI_BASE_URL}/scan-image`, {
    method: "POST",
    body: formData,
  });

  return parseResponse(response);
}

// PDF scanning
export async function scanPdf(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${AI_BASE_URL}/scan-pdf`, {
    method: "POST",
    body: formData,
  });

  return parseResponse(response);
}

// Audio transcription
export async function transcribeAudio(file, language = "auto") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("language", language);

  const response = await fetch(`${AI_BASE_URL}/transcribe-audio`, {
    method: "POST",
    body: formData,
  });

  return parseResponse(response);
}

// Load conversations
export async function getConversations() {
  if (useLocalConversationStorage()) {
    return readLocalConversations();
  }

  const response = await fetch(`${BACKEND_BASE_URL}/conversations`);
  return parseResponse(response);
}

// Save conversation
export async function saveConversation(conversation) {
  if (useLocalConversationStorage()) {
    const conversations = readLocalConversations();
    const saved = {
      ...conversation,
      id: String(conversation.id),
      title: conversation.title || "Sarathi AI chat",
      messages: conversation.messages || [],
      time: conversation.time || new Date().toISOString(),
    };

    const index = conversations.findIndex(
      (item) => String(item.id) === saved.id
    );

    if (index >= 0) {
      conversations[index] = saved;
    } else {
      conversations.unshift(saved);
    }

    writeLocalConversations(conversations);
    return saved;
  }

  const response = await fetch(`${BACKEND_BASE_URL}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: String(conversation.id),
      title: conversation.title || "Sarathi AI chat",
      messages: conversation.messages || [],
      time: conversation.time || new Date().toISOString(),
    }),
  });

  return parseResponse(response);
}

// Delete conversation
export async function deleteConversation(conversationId) {
  if (useLocalConversationStorage()) {
    const conversations = readLocalConversations().filter(
      (item) => String(item.id) !== String(conversationId)
    );

    writeLocalConversations(conversations);
    return { success: true };
  }

  const response = await fetch(
    `${BACKEND_BASE_URL}/conversations/${encodeURIComponent(conversationId)}`,
    { method: "DELETE" }
  );

  return parseResponse(response);
}
