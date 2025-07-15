// src/utils/storage.js
export const getUsedStorageMB = () => {
  const saved = localStorage.getItem('uploadedFiles');
  if (!saved) return 0;
  return JSON.parse(saved)
    .reduce((sum, f) => sum + parseFloat(f.size || 0), 0)
    .toFixed(2);
};

export const getFileList = () => {
  const saved = localStorage.getItem('uploadedFiles');
  return saved ? JSON.parse(saved).map((f, i) => ({ id: i, ...f })) : [];
};

export const deleteFile = (id) => {
  const files = getFileList().filter(f => f.id !== id);
  localStorage.setItem('uploadedFiles', JSON.stringify(files));
};

export const renameFile = (id, newName) => {
  const files = getFileList().map(f => f.id === id ? { ...f, name: newName } : f);
  localStorage.setItem('uploadedFiles', JSON.stringify(files));
};

export const tagFile = (id, tag) => {
  const files = getFileList().map(f => f.id === id ? { ...f, tags: [...(f.tags||[]), tag] } : f);
  localStorage.setItem('uploadedFiles', JSON.stringify(files));
};

export const getStorageHistory = () => {
  const now = Date.now();
  return Array.from({ length: 7 }).map((_, idx) => ({
    date: new Date(now - ((6 - idx) * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    used: Math.random() * getUsedStorageMB(),
  }));
};
