// Temple Media Storage & Multi-Device Sync Engine
// Supports IndexedDB (Local HD Video & Photos) + GitHub Auto-Publish API

const DB_NAME = "NadipudiTempleMediaDB";
const STORE_NAME = "templeMediaItems";
const DB_VERSION = 1;

/**
 * Initializes IndexedDB for large media files (photos & recorded videos)
 */
export function openTempleMediaDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB is not supported in this browser"));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Fetch all locally stored photos and videos from IndexedDB
 */
export async function getLocalMediaItems() {
  try {
    const db = await openTempleMediaDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        resolve(req.result || []);
      };

      req.onerror = () => {
        reject(req.error);
      };
    });
  } catch (err) {
    console.warn("Failed to load items from IndexedDB, falling back to empty list:", err);
    return [];
  }
}

/**
 * Save a new media item (photo/video) to IndexedDB
 */
export async function saveLocalMediaItem(item) {
  const db = await openTempleMediaDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(item);

    req.onsuccess = () => {
      resolve(item);
    };

    req.onerror = () => {
      reject(req.error);
    };
  });
}

/**
 * Delete a media item by ID from IndexedDB
 */
export async function deleteLocalMediaItem(id) {
  const db = await openTempleMediaDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);

    req.onsuccess = () => {
      resolve(true);
    };

    req.onerror = () => {
      reject(req.error);
    };
  });
}

/**
 * Client-side photo compressor to ensure crisp display & efficient storage
 */
export function compressImageFile(file, maxWidth = 1600, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = readerEvent.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a video File into a persistent base64 data URL
 */
export function convertVideoToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Converts YouTube, Shorts, Google Drive, or standard URLs into embed-friendly URLs
 */
export function parseMediaUrl(inputUrl) {
  if (!inputUrl) return { embedUrl: "", type: "unknown" };
  const url = inputUrl.trim();

  // YouTube standard or short links
  // e.g. https://www.youtube.com/watch?v=XXXX or https://youtu.be/XXXX or shorts/XXXX
  const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/))([A-Za-z0-9_-]{11})/;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const vidId = ytMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${vidId}?autoplay=0&rel=0`,
      thumbnail: `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`,
      type: "youtube",
      rawId: vidId
    };
  }

  // Google Drive preview links
  const gdriveRegex = /drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/;
  const gdriveMatch = url.match(gdriveRegex);
  if (gdriveMatch && gdriveMatch[1]) {
    return {
      embedUrl: `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`,
      type: "gdrive",
      thumbnail: ""
    };
  }

  // Direct MP4 / WebM video files
  if (url.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i)) {
    return {
      embedUrl: url,
      type: "video_url",
      thumbnail: ""
    };
  }

  // Default image URL
  return {
    embedUrl: url,
    type: "image_url",
    thumbnail: url
  };
}

/**
 * Sync media items directly to GitHub Repository so GitHub Pages auto-updates!
 * Works directly from phone using the owner's GitHub Personal Access Token (stored locally on device).
 */
export async function syncMediaToGitHub({
  token,
  owner = "krishnasidhvi",
  repo = "nadipudi-village-portal",
  filePath = "src/data/communityTempleMedia.json",
  itemToAdd
}) {
  if (!token) {
    throw new Error("GitHub Personal Access Token is required to commit to repository.");
  }

  const cleanToken = token.trim();
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  // 1. Fetch current file sha & content
  const getRes = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${cleanToken}`,
      Accept: "application/vnd.github.v3+json"
    }
  });

  if (!getRes.ok && getRes.status !== 404) {
    const errText = await getRes.text();
    throw new Error(`Failed to fetch file from GitHub: ${getRes.status} ${errText}`);
  }

  let sha = null;
  let currentList = [];

  if (getRes.ok) {
    const fileData = await getRes.json();
    sha = fileData.sha;
    // Decode base64
    try {
      const decodedStr = decodeURIComponent(escape(atob(fileData.content.replace(/\s/g, ""))));
      currentList = JSON.parse(decodedStr);
    } catch {
      currentList = [];
    }
  }

  // 2. Prepend new item (lightweight metadata with URLs or cloud links)
  // For safety and fast git commits, we keep media URLs, links, or image URLs
  const cleanItem = {
    id: itemToAdd.id,
    type: itemToAdd.type,
    titleTe: itemToAdd.titleTe,
    titleEn: itemToAdd.titleEn,
    mediaUrl: itemToAdd.mediaUrl || itemToAdd.embedUrl || "",
    thumbnail: itemToAdd.thumbnail || "",
    category: itemToAdd.category || "darshan",
    categoryTe: itemToAdd.categoryTe || "భక్తుల సమర్పణ",
    categoryEn: itemToAdd.categoryEn || "Devotee Contribution",
    contributor: itemToAdd.contributor || "నడిపూడి భక్తులు",
    date: itemToAdd.date || new Date().toISOString().split("T")[0],
    descTe: itemToAdd.descTe || "",
    descEn: itemToAdd.descEn || ""
  };

  const updatedList = [cleanItem, ...currentList.filter((x) => x.id !== cleanItem.id)];
  const updatedContentStr = JSON.stringify(updatedList, null, 2);
  const encodedContent = btoa(unescape(encodeURIComponent(updatedContentStr)));

  // 3. Commit to GitHub repo via PUT
  const commitRes = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${cleanToken}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.v3+json"
    },
    body: JSON.stringify({
      message: `Add temple ${itemToAdd.type}: "${itemToAdd.titleEn || itemToAdd.titleTe}" via Mobile Media Hub`,
      content: encodedContent,
      sha: sha
    })
  });

  if (!commitRes.ok) {
    const errData = await commitRes.json();
    throw new Error(errData.message || "Failed to commit to GitHub");
  }

  return await commitRes.json();
}
