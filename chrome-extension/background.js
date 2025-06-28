chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FETCH_HINTS") {
    console.log("🚀 FETCH_HINTS received in background.js");
    
    // Handle the request synchronously to avoid message channel issues
    handleFetchHintsSync(sendResponse);
    
    // Return true to indicate we'll send a response asynchronously
    return true;
  }
});

function handleFetchHintsSync(sendResponse) {
  console.log("🔧 Starting handleFetchHintsSync");
  let responded = false;
  const timeout = setTimeout(() => {
    if (!responded) {
      responded = true;
      console.error('❌ Timeout: No response from backend after 10s');
      sendResponse({ error: 'Timeout: No response from backend.' });
    }
  }, 10000);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("📋 Tabs query result:", tabs);
    const activeTab = tabs[0];
    
    if (!activeTab) {
      if (!responded) {
        responded = true;
        clearTimeout(timeout);
        console.error("❌ No active tab found");
        sendResponse({ error: "No active tab found" });
      }
      return;
    }

    console.log("📋 Active tab:", activeTab?.url);

    // Check if we're on a LeetCode page
    if (!activeTab.url.includes('leetcode.com')) {
      if (!responded) {
        responded = true;
        clearTimeout(timeout);
        console.warn("❌ Not on a LeetCode page:", activeTab.url);
        sendResponse({ error: "Please navigate to a LeetCode page" });
      }
      return;
    }

    console.log("✅ On LeetCode page, injecting content script...");

    // Inject content script first
    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      files: ['content.js']
    }, (injectionResults) => {
      console.log("📥 Content script injection result:", injectionResults);
      
      if (chrome.runtime.lastError) {
        if (!responded) {
          responded = true;
          clearTimeout(timeout);
          console.error("❌ Script injection error:", chrome.runtime.lastError);
          sendResponse({ error: "Failed to inject content script: " + chrome.runtime.lastError.message });
        }
        return;
      }

      // After script injection, send message to content script
      console.log("📤 Sending GET_PROBLEM message to content script...");
      
      chrome.tabs.sendMessage(activeTab.id, { type: "GET_PROBLEM" }, (problem) => {
        console.log("📥 Received response from content script:", problem);
        
        if (chrome.runtime.lastError) {
          if (!responded) {
            responded = true;
            clearTimeout(timeout);
            console.error("❌ Runtime error:", chrome.runtime.lastError);
            sendResponse({ error: "Failed to communicate with page. Please refresh and try again." });
          }
          return;
        }

        console.log("📥 Got problem from content:", problem);
        
        // If title or description is missing, return early
        if (!problem || !problem.title || !problem.description) {
          if (!responded) {
            responded = true;
            clearTimeout(timeout);
            console.warn("❌ Missing problem data:", problem);
            sendResponse({ error: "Could not extract problem from the page. Please make sure you're on a LeetCode problem page." });
          }
          return;
        }

        console.log("🌐 Making request to backend...");
        
        // Use the real Gemini API endpoint
        const backendUrl = "http://localhost:3000/api/hints";
        
        // Make the fetch request
        fetch(backendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(problem),
        })
        .then(res => {
          console.log("📡 Backend response status:", res.status);
          
          if (!res.ok) {
            return res.text().then(errorText => {
              if (!responded) {
                responded = true;
                clearTimeout(timeout);
                console.error("❌ Server responded with error:", res.status, errorText);
                sendResponse({
                  error: `Server Error: ${res.status} - ${errorText}`,
                });
              }
            });
          }
          
          return res.json();
        })
        .then(data => {
          if (!responded) {
            responded = true;
            clearTimeout(timeout);
            console.log("✅ Successfully got hints from backend:", data);
            sendResponse({
              title: problem.title,
              hints: data.hints,
            });
          }
        })
        .catch(err => {
          if (!responded) {
            responded = true;
            clearTimeout(timeout);
            console.error("❌ Error during fetch or JSON:", err);
            sendResponse({ error: "Server Error: " + err.message });
          }
        });
      });
    });
  });
}