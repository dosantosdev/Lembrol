const STORAGE_KEY = "lembrol-data";

export function loadData() {
  const storedData = localStorage.getItem(STORAGE_KEY);

  if (!storedData) {
    return null;
  }

  try {
    return JSON.parse(storedData);
  } catch {
    return null;
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearData() {
  localStorage.removeItem(STORAGE_KEY);
}
