const titleDiv = document.getElementById("problem-title");
const hintsDiv = document.getElementById("hints");
const getHintBtn = document.getElementById("getHintBtn");
const clearBtn = document.getElementById("clearBtn");
const statusDiv = document.getElementById("status");

// Storage keys
const STORAGE_KEYS = {
  LAST_PROBLEM: 'lastProblem',
  LAST_HINTS: 'lastHints',
  LAST_TIMESTAMP: 'lastTimestamp'
};

// Initialize the popup
document.addEventListener('DOMContentLoaded', () => {
  loadSavedData();
  setupEventListeners();
  checkCurrentPage();
});

function setupEventListeners() {
  getHintBtn.addEventListener("click", handleGetHints);
  clearBtn.addEventListener("click", handleClearHistory);
}

function checkCurrentPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentUrl = tabs[0]?.url;
    if (currentUrl && currentUrl.includes('leetcode.com/problems/')) {
      updateStatus("Ready to extract hints from this problem");
    } else if (currentUrl && currentUrl.includes('leetcode.com')) {
      updateStatus("Navigate to a specific problem page");
    } else {
      updateStatus("Go to LeetCode to use this extension");
    }
  });
}

async function handleGetHints() {
  // Show loading state
  setLoadingState(true);
  updateStatus("Fetching problem data...");

  chrome.runtime.sendMessage({ type: "FETCH_HINTS" }, async (response) => {
    setLoadingState(false);
    
    if (response?.error) {
      showError(response.error);
      updateStatus("Error occurred");
    } else if (response?.hints) {
      showSuccess(response.title, response.hints);
      saveData(response.title, response.hints);
      updateStatus("Hints generated successfully");
    } else {
      showWarning("No hints received from server.");
      updateStatus("No data received");
    }
  });
}

function handleClearHistory() {
  chrome.storage.local.remove([STORAGE_KEYS.LAST_PROBLEM, STORAGE_KEYS.LAST_HINTS, STORAGE_KEYS.LAST_TIMESTAMP], () => {
    showWelcomeMessage();
    clearBtn.style.display = 'none';
    updateStatus("History cleared");
  });
}

function setLoadingState(isLoading) {
  getHintBtn.disabled = isLoading;
  getHintBtn.innerHTML = isLoading 
    ? '<span class="btn-icon">⏳</span><span class="btn-text">Loading...</span>'
    : '<span class="btn-icon">💡</span><span class="btn-text">Get Hints</span>';
  
  titleDiv.className = isLoading ? 'problem-title loading' : 'problem-title';
  titleDiv.innerHTML = isLoading 
    ? '<span class="placeholder">Fetching problem...</span>'
    : '<span class="placeholder">Click "Get Hints" to start</span>';
}

function showWelcomeMessage() {
  titleDiv.innerHTML = '<span class="placeholder">Click "Get Hints" to start</span>';
  hintsDiv.innerHTML = `
    <div class="welcome-message">
      <div class="welcome-icon">🚀</div>
      <h3>Ready to get hints?</h3>
      <p>Navigate to a LeetCode problem and click the button below to get AI-powered hints and guidance.</p>
    </div>
  `;
}

function showError(error) {
  titleDiv.innerHTML = '<span class="placeholder">Error occurred</span>';
  hintsDiv.innerHTML = `
    <div class="error-message">
      <strong>Error:</strong> ${error}
    </div>
  `;
}

function showWarning(message) {
  titleDiv.innerHTML = '<span class="placeholder">Warning</span>';
  hintsDiv.innerHTML = `
    <div class="warning-message">
      <strong>Warning:</strong> ${message}
    </div>
  `;
}

function showSuccess(title, hints) {
  titleDiv.innerHTML = `<strong>${title}</strong>`;
  hintsDiv.innerHTML = `<div class="hint-content">${formatHints(hints)}</div>`;
  clearBtn.style.display = 'block';
}

function updateStatus(message) {
  statusDiv.textContent = message;
  setTimeout(() => {
    statusDiv.textContent = '';
  }, 3000);
}

function saveData(title, hints) {
  const data = {
    [STORAGE_KEYS.LAST_PROBLEM]: title,
    [STORAGE_KEYS.LAST_HINTS]: hints,
    [STORAGE_KEYS.LAST_TIMESTAMP]: Date.now()
  };
  
  chrome.storage.local.set(data, () => {
    console.log('Data saved successfully');
  });
}

function loadSavedData() {
  chrome.storage.local.get([STORAGE_KEYS.LAST_PROBLEM, STORAGE_KEYS.LAST_HINTS, STORAGE_KEYS.LAST_TIMESTAMP], (result) => {
    if (result[STORAGE_KEYS.LAST_PROBLEM] && result[STORAGE_KEYS.LAST_HINTS]) {
      const timestamp = result[STORAGE_KEYS.LAST_TIMESTAMP];
      const timeAgo = getTimeAgo(timestamp);
      
      showSuccess(result[STORAGE_KEYS.LAST_PROBLEM], result[STORAGE_KEYS.LAST_HINTS]);
      clearBtn.style.display = 'block';
      updateStatus(`Last updated: ${timeAgo}`);
    } else {
      showWelcomeMessage();
    }
  });
}

function getTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

function formatHints(text) {
  // Handle JSON responses from Gemini
  if (text.includes('```json')) {
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[1]);
        let formattedText = "";
        
        if (jsonData.concepts && jsonData.concepts.length > 0) {
          formattedText += `
            <h3>📚 Key Concepts</h3>
            <ul>
              ${jsonData.concepts.map(concept => `<li>${concept}</li>`).join('')}
            </ul>
          `;
        }
        
        if (jsonData.hints && jsonData.hints.length > 0) {
          formattedText += `
            <h3>💡 Hints</h3>
            <ol>
              ${jsonData.hints.map(hint => `<li>${hint}</li>`).join('')}
            </ol>
          `;
        }
        
        if (jsonData.encouragement) {
          formattedText += `
            <div class="encouragement">
              <strong>💪 Encouragement:</strong> ${jsonData.encouragement}
            </div>
          `;
        }
        
        return formattedText;
      }
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
    }
  }
  
  // Fallback to simple text formatting
  return text.split("\n").map(line => {
    if (line.trim() === "") return "<br>";
    if (line.startsWith("Concepts:")) return `<h3>📚 ${line}</h3>`;
    if (line.startsWith("Hints:")) return `<h3>💡 ${line}</h3>`;
    if (line.startsWith("- ")) return `<li>${line.substring(2)}</li>`;
    if (line.match(/^\d+\./)) return `<li>${line}</li>`;
    return `<p>${line}</p>`;
  }).join("");
}