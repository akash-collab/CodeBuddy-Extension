chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_PROBLEM") {
    console.log("📥 GET_PROBLEM received in content.js");
    console.log("🔍 Current URL:", window.location.href);

    try {
      // Wait a bit for the page to fully load
      setTimeout(() => {
        extractProblemData(sendResponse);
      }, 1000);
    } catch (err) {
      console.error("❌ Error in message listener:", err);
      sendResponse({ title: "", description: "" });
    }
  }

  return true;
});

function extractProblemData(sendResponse) {
  try {
    // Try multiple selectors for the title
    const titleSelectors = [
      "h1",
      "[data-cy='question-title']",
      ".mr-2.text-label-1",
      ".text-xl.font-medium",
      ".text-title-large",
      "[data-track-load='question_title']",
      ".break-words",
      ".text-2xl",
      ".text-3xl",
      "[class*='title']",
      "[class*='Title']"
    ];
    
    let title = "";
    for (const selector of titleSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const text = element.innerText?.trim();
        if (text && text.length > 0 && text.length < 100) { // Reasonable title length
          title = text;
          console.log("✅ Found title with selector:", selector, title);
          break;
        }
      }
      if (title) break;
    }

    // Try multiple selectors for the description
    const descriptionSelectors = [
      ".description__24sA",
      ".question-content__JfgR", 
      "div[data-track-load='description_content']",
      "[data-cy='question-content']",
      ".content__u3I1",
      ".description",
      ".xFUwe",
      "[data-track-load='description_content'] div",
      ".question-content",
      ".content__u3I1 div",
      "[class*='description']",
      "[class*='content']",
      ".break-words",
      ".whitespace-pre-wrap"
    ];
    
    let description = "";
    for (const selector of descriptionSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const text = element.innerText?.trim();
        if (text && text.length > 100) { // Ensure we have meaningful content
          description = text;
          console.log("✅ Found description with selector:", selector, description.substring(0, 100) + "...");
          break;
        }
      }
      if (description) break;
    }

    // If still no description, try to find any large text block
    if (!description) {
      const allDivs = document.querySelectorAll('div');
      for (const div of allDivs) {
        const text = div.innerText?.trim();
        if (text && text.length > 200 && text.length < 5000) {
          // Check if it looks like a problem description
          if (text.includes('Example') || text.includes('Input') || text.includes('Output') || 
              text.includes('Constraints') || text.includes('Follow up')) {
            description = text;
            console.log("✅ Found description in large text block:", description.substring(0, 100) + "...");
            break;
          }
        }
      }
    }

    console.log("🔍 Final extracted data:", { 
      title, 
      descriptionLength: description?.length,
      descriptionPreview: description?.substring(0, 100) + "..." 
    });

    if (!title || !description) {
      console.warn("❌ Could not find title or description in the current page.");
      console.log("🔍 Available elements:", {
        h1: document.querySelector("h1")?.innerText,
        titleElements: titleSelectors.map(s => ({ selector: s, text: document.querySelector(s)?.innerText?.substring(0, 50) })),
        descriptionElements: descriptionSelectors.map(s => ({ selector: s, text: document.querySelector(s)?.innerText?.substring(0, 50) }))
      });
      
      // Try to get any text content that might be the problem
      const allText = document.body.innerText;
      console.log("🔍 All page text preview:", allText.substring(0, 500));
      
      sendResponse({ title: "", description: "" });
      return;
    }

    sendResponse({ title, description });
  } catch (err) {
    console.error("❌ Error extracting problem data:", err);
    sendResponse({ title: "", description: "" });
  }
}