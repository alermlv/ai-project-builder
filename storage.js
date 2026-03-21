import { APP_STORAGE_KEY } from "./config.js";

export function loadAppState() {
  try {
    const raw = localStorage.getItem(APP_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to load app state from localStorage:", error);
    return null;
  }
}

export function saveAppState(state) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(APP_STORAGE_KEY, serialized);
  } catch (error) {
    console.error("Failed to save app state to localStorage:", error);
  }
}

export function clearAppState() {
  try {
    localStorage.removeItem(APP_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear app state from localStorage:", error);
  }
}
