chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "SCRAPE_JOB_INFO") {
    function extractTextByPriority(selectors) {
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText.trim()) return el.innerText.trim();
      }
      return '';
    }

    const title = extractTextByPriority(['h1', 'h2', '[class*="title"]']);
    const company = extractTextByPriority(['[class*="company"]', '[data-company]', '.company-name']);
    const location = extractTextByPriority(['[class*="location"]', '[data-location]', '.job-location']);

    sendResponse({ title, company, location });
    return true; // Ensures channel stays open for async responses
  }
});
