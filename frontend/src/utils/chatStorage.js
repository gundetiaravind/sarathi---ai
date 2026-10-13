
const STORAGE_KEY = "sarathi-ai-conversations-v1";

export function loadConversations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((conversation) => ({
      ...conversation,
      messages: (conversation.messages || []).map((message) => ({
        ...message,
        time: message.time || new Date().toISOString(),
      })),
    }));
  } catch (error) {
    console.error("Could not load Sarathi AI conversations:", error);
    return [];
  }
}

export function saveConversations(conversations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    return true;
  } catch (error) {
    console.error("Could not save Sarathi AI conversations:", error);
    return false;
  }
}
