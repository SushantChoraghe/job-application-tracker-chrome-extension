let editMode = false;

function escapeHTML(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getStatusClass(status = '') {
  return `status-color-${String(status || 'Application').replace(/\s/g, '')}`;
}

function showMessage(text, color = "#10b981") {
  const msg = document.getElementById('statusMsg');
  msg.textContent = text;
  msg.style.backgroundColor = color + "22";
  msg.style.color = color;
  msg.classList.add('show');
  clearTimeout(msg._timeout);
  msg._timeout = setTimeout(() => msg.classList.remove('show'), 2000);
}

// Normalize links (auto-add https:// if missing)
function normalizeLink(url) {
  if (!url) return "";
  url = url.trim();
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return "https://" + url;
}

function renderJobs() {
  chrome.storage.local.get(['jobEntries'], (result) => {
    const jobs = result.jobEntries || [];
    const tbody = document.querySelector('#jobsTable tbody');
    tbody.innerHTML = '';

    jobs.forEach((job, index) => {
      const status = job.status || "Application";
      const link = normalizeLink(job.link || "");
      const linkHTML = link
        ? `<a href="${escapeHTML(link)}" target="_blank" class="link-btn">🔗 Open</a>`
        : `<span class="no-link">No link</span>`;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${escapeHTML(job.company || '')}</td>
        <td>${escapeHTML(job.title || '')}</td>
        <td>${escapeHTML(job.location || '')}</td>
        <td>
          <select class="status-select ${getStatusClass(status)}" data-index="${index}">
            <option value="Application" ${status === 'Application' ? 'selected' : ''}>Application</option>
            <option value="Interview" ${status === 'Interview' ? 'selected' : ''}>Interview</option>
            <option value="Offer" ${status === 'Offer' ? 'selected' : ''}>Offer</option>
            <option value="Rejected" ${status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </td>
        <td>${linkHTML}</td>
        <td><button class="save-btn" data-index="${index}">Save</button></td>
        <td><button class="delete-btn" data-index="${index}">Delete</button></td>
      `;

      tbody.appendChild(row);
    });

    document.querySelectorAll('.status-select').forEach((select) => {
      select.addEventListener('change', (e) => {
        e.target.className = `status-select ${getStatusClass(e.target.value)}`;
      });
    });

    document.querySelectorAll('.save-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        const select = document.querySelector(`.status-select[data-index="${idx}"]`);
        const newStatus = select.value;

        chrome.storage.local.get(['jobEntries'], (res) => {
          const current = res.jobEntries || [];
          if (!current[idx]) return;
          current[idx].status = newStatus;
          chrome.storage.local.set({ jobEntries: current }, () => {
            showMessage("✅ Status saved.", "#10b981");
          });
        });
      });
    });

    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        chrome.storage.local.get(['jobEntries'], (res) => {
          const current = res.jobEntries || [];
          if (!current[idx]) return;
          current.splice(idx, 1);
          chrome.storage.local.set({ jobEntries: current }, () => {
            renderJobs();
            showMessage("🗑️ Job deleted.", "#ef4444");
          });
        });
      });
    });
  });
}

// Save All
document.getElementById("saveAllBtn").addEventListener("click", () => {
  chrome.storage.local.get(['jobEntries'], (result) => {
    const jobs = result.jobEntries || [];

    document.querySelectorAll('.status-select').forEach(select => {
      const idx = parseInt(select.dataset.index, 10);
      const newStatus = select.value;
      if (jobs[idx]) {
        jobs[idx].status = newStatus;
      }
    });

    chrome.storage.local.set({ jobEntries: jobs }, () => {
      showMessage("✅ All statuses saved.", "#10b981");
    });
  });
});

// Download CSV
document.getElementById("downloadBtn").addEventListener("click", () => {
  chrome.storage.local.get(['jobEntries'], (result) => {
    const jobs = result.jobEntries || [];

    const csv = [
      ["Company", "Title", "Location", "Status", "Job Link (URL)"],
      ...jobs.map(j => [
        j.company || "",
        j.title || "",
        j.location || "",
        j.status || "",
        j.link || ""
      ])
    ]
      .map(row => row.map(item => `"${item}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "saved_jobs.csv";
    a.click();
    URL.revokeObjectURL(url);
  });
});

// Toggle Edit Mode
document.getElementById("toggleEditBtn").addEventListener("click", () => {
  editMode = !editMode;
  showMessage(editMode ? "🔓 Edit Mode Enabled" : "🔒 Edit Mode Disabled", "#3b82f6");
});

// Initial render
renderJobs();
