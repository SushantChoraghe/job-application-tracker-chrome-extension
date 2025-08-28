document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab || !tab.id) {
      document.getElementById('message').textContent = "⚠️ Cannot find active tab.";
      return;
    }

    chrome.tabs.sendMessage(tab.id, { type: "SCRAPE_JOB_INFO" }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn("⚠️ Content script not available:", chrome.runtime.lastError.message);
        document.getElementById('message').textContent =
          "⚠️ Could not fetch job info. Try refreshing the page or navigating to a supported job listing.";
        return;
      }

      if (!response) {
        document.getElementById('message').textContent =
          "⚠️ No job information found on this page.";
        return;
      }

      const { title, company, location } = response;
      document.getElementById('title').value = title || '';
      document.getElementById('company').value = company || '';
      document.getElementById('location').value = location || '';
      document.getElementById('link').value = tab.url;
      document.getElementById('date').value = formatDate(new Date());
    });
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    const job = getFormData();
    chrome.storage.local.get({ jobEntries: [] }, (data) => {
      const updated = [...data.jobEntries, job];
      chrome.storage.local.set({ jobEntries: updated }, () => {
        document.getElementById('message').textContent =
          `✅ Job saved! You now have ${updated.length} entries.`;
      });
    });
  });

  document.getElementById('viewBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('view.html') });
  });
});

function getFormData() {
  return {
    company: document.getElementById('company').value,
    title: document.getElementById('title').value,
    location: document.getElementById('location').value,
    university: document.getElementById('university').value,
    documents: document.getElementById('documents').value,
    status: document.getElementById('status').value,
    link: document.getElementById('link').value,
    date: document.getElementById('date').value
  };
}

function formatDate(d) {
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}
