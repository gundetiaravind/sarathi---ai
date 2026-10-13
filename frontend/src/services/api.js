const BACKEND_BASE_URL = "/api";
const AI_BASE_URL =
  "https://peripherals-ends-worth-cables.trycloudflare.com/api";

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail || data.message || `Request failed: ${response.status}`
    );
  }

  return data;
}

// Java backend health
export async function checkBackendHealth() {
  const response = await fetch(`${BACKEND_BASE_URL}/health`);
  return parseResponse(response);
}

// Local Python AI health
export async function checkAIHealth() {
  const response = await fetch(`${AI_BASE_URL}/health`);
  return parseResponse(response);
}

// Chat with local AI
export async function sendChatMessage(message, language = "auto") {
  const response = await fetch(`${AI_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, language }),
  });

  return parseResponse(response);
}

// Scan image using local AI service
export async function scanImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${AI_BASE_URL}/scan-image`, {
    method: "POST",
    body: formData,
  });

  return parseResponse(response);
}

// Read PDF using local AI service
export async function scanPdf(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${AI_BASE_URL}/scan-pdf`, {
    method: "POST",
    body: formData,
  });

  return parseResponse(response);
}

// Transcribe recorded audio
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

// Load conversations from MySQL through Java
export async function getConversations() {
  const response = await fetch(`${BACKEND_BASE_URL}/conversations`);
  return parseResponse(response);
}

// Save or update a conversation in MySQL
export async function saveConversation(conversation) {
  const response = await fetch(`${BACKEND_BASE_URL}/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: String(conversation.id),
      title: conversation.title || "Sarathi AI chat",
      messages: conversation.messages || [],
      time: conversation.time || new Date().toISOString(),
    }),
  });

  return parseResponse(response);
}

// Delete a conversation from MySQL
export async function deleteConversation(conversationId) {
  const response = await fetch(
    `${BACKEND_BASE_URL}/conversations/${encodeURIComponent(conversationId)}`,
    {
      method: "DELETE",
    }
  );

  return parseResponse(response);
}
