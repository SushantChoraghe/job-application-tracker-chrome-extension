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
      document.getElementById('url').value = tab.url;
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
        document.getElementById('message').style.color = "#16a34a"; // green
      });
    });
  });

  document.getElementById('downloadAllBtn').addEventListener('click', () => {
    chrome.storage.local.get({ jobEntries: [] }, (data) => {
      if (data.jobEntries.length === 0) {
        alert("⚠️ No job entries to download.");
        return;
      }

      const headers = [
        "No.",
        "Date",
        "Company Name",
        "University Name",
        "Location",
        "Title",
        "Documents",
        "Status",
        "Link"
      ];

      const rows = data.jobEntries.map((entry, index) => [
        index + 1,
        entry.date,
        entry.company,
        entry.university,
        entry.location,
        entry.title,
        entry.documents,
        entry.status,
        entry.url
      ]);

      const csv = [headers, ...rows].map(row => row.map(escapeCSV).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const downloadUrl = URL.createObjectURL(blob);

      chrome.downloads.download({
        url: downloadUrl,
        filename: "job-applications.csv"
      });
    });
  });

  document.getElementById('viewBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('view.html') });
  });
});

// Helper functions
function getFormData() {
  return {
    company: document.getElementById('company').value,
    title: document.getElementById('title').value,
    location: document.getElementById('location').value,
    university: document.getElementById('university').value,
    documents: document.getElementById('documents').value,
    status: document.getElementById('status').value,
    url: document.getElementById('url').value,
    date: document.getElementById('date').value
  };
}

function formatDate(d) {
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

function escapeCSV(value) {
  if (typeof value !== 'string') return value;
  return `"${value.replace(/"/g, '""')}"`;
}
