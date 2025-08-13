document.addEventListener('DOMContentLoaded', () => {
  // Step 1: Get job info using messaging
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, { type: "SCRAPE_JOB_INFO" }, (response) => {
      const { title, company, location } = response || {};
      document.getElementById('title').value = title || '';
      document.getElementById('company').value = company || '';
      document.getElementById('location').value = location || '';
      document.getElementById('url').value = tab.url;
      document.getElementById('date').value = formatDate(new Date());
    });
  });

  // Step 2: Save job entry
  document.getElementById('saveBtn').addEventListener('click', () => {
    const job = getFormData();
    chrome.storage.local.get({ jobEntries: [] }, (data) => {
      const updated = [...data.jobEntries, job];
      chrome.storage.local.set({ jobEntries: updated }, () => {
        alert("✅ Job saved! You now have " + updated.length + " entries.");
      });
    });
  });

  // Step 3: Download all entries as CSV
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
