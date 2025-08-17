chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "SCRAPE_JOB_INFO") {
    // Helper to get text from any valid selector
    function extractTextByPriority(selectors) {
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && el.textContent.trim()) return el.textContent.trim();
      }
      return '';
    }

    // Wait 1s in case the page loads content dynamically
    setTimeout(() => {
      const title = extractTextByPriority([
        // Common
        'h1', 'h2', '[class*="job-title"]', '[class*="title"]',
        // Workday
        '[data-automation-id="jobPostingHeader"]',
        '[data-automation-id="job-title"]',
        // Greenhouse, Lever
        '.posting-headline h2',
        '.posting-title',
        // Meta
        '[data-job-title]'
      ]);

      const location = extractTextByPriority([
        // Common
        '[class*="location"]', '[data-location]', '.job-location',
        // Workday
        '[data-automation-id="locations"]',
        // Lever
        '.location',
        // Greenhouse
        '.posting-categories > div',
        // Visual/semantic fallback
        'li:has(svg[aria-label="Location"])'
      ]);

      const company = extractTextByPriority([
        // Common
        '[class*="company"]', '.company-name',
        '[data-company]', '.employer',
        // Workday
        'meta[property="og:site_name"]',
        // Generic fallback
        'title'
      ]);

      console.log("Scraped from content.js:", { title, company, location });
      sendResponse({ title, company, location });
    }, 1000); // Delay for dynamic content

    return true; // Keep message channel open
  }
});
