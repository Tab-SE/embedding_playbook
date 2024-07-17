// /lib/sessions.js
const sessions = {};

function getSession(sessionId) {
  return sessions[sessionId];
}

function setSession(sessionId, sessionData) {
  sessions[sessionId] = sessionData;
}

function deleteSession(sessionId) {
  delete sessions[sessionId];
}

export { getSession, setSession, deleteSession };
