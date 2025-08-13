// This script runs on every page and listens for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "SCRAPE_JOB_INFO") {
    const title = document.querySelector('h1')?.innerText || '';
    const company = document.querySelector('[class*="company"]')?.innerText || '';
    const location = document.querySelector('[class*="location"]')?.innerText || '';

    sendResponse({
      title,
      company,
      location
    });
  }
});
