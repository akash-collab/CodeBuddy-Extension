chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FETCH_HINTS") {
    console.log("🚀 FETCH_HINTS received in background.js");
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log("📋 Active tab:", tabs[0]?.url);
      
      // ✅ Fix: no async inside chrome.tabs.sendMessage
      chrome.tabs.sendMessage(tabs[0].id, { type: "GET_PROBLEM" }, async (problem) => {
        try {
          console.log("📥 Got problem from content:", problem);
          
          // If title or description is missing, return early
          if (!problem.title || !problem.description) {
            console.warn("❌ Missing problem data:", problem);
            sendResponse({ error: "Could not extract problem from the page." });
            return;
          }

          console.log("🌐 Making request to backend...");
          
          // Use production backend URL - you'll need to deploy your backend
          const backendUrl = "https://your-backend-domain.com/api/hints"; // Replace with your actual backend URL
          
          const res = await fetch(backendUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(problem),
          });

          console.log("📡 Backend response status:", res.status);

          // Check if the response is ok before parsing JSON
          if (!res.ok) {
            const errorText = await res.text();
            console.error("❌ Server responded with error:", res.status, errorText);
            sendResponse({
              error: `Server Error: ${res.status} - ${errorText}`,
            });
            return;
          }

          const data = await res.json();
          console.log("✅ Successfully got hints from backend");
          sendResponse({
            title: problem.title,
            hints: data.hints,
          });
        } catch (err) {
          console.error("❌ Error during fetch or JSON:", err);
          sendResponse({ error: "Server Error: " + err.message });
        }
      });

      // ✅ Must return true here to keep the message channel alive
      return true;
    });

    // ✅ Also return true here
    return true;
  }
});