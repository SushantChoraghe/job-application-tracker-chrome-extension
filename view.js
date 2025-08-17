let editMode = false;

function renderJobs() {
  chrome.storage.local.get(['jobEntries'], (result) => {
    const jobs = result.jobEntries || [];
    const tbody = document.querySelector('#jobsTable tbody');
    const statusMsg = document.getElementById('statusMsg');
    tbody.innerHTML = '';

    jobs.forEach((job, index) => {
      const row = document.createElement('tr');

      const companyCell = editMode
        ? `<input type="text" class="edit-input" value="${job.company}" data-field="company" data-index="${index}">`
        : `<span>${job.company}</span>`;

      const titleCell = editMode
        ? `<input type="text" class="edit-input" value="${job.title}" data-field="title" data-index="${index}">`
        : `<span>${job.title}</span>`;

      const locationCell = editMode
        ? `<input type="text" class="edit-input" value="${job.location}" data-field="location" data-index="${index}">`
        : `<span>${job.location}</span>`;

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${companyCell}</td>
        <td>${titleCell}</td>
        <td>${locationCell}</td>
        <td>
          <select class="status-select ${getStatusClass(job.status)}" data-index="${index}">
            <option value="Application" ${job.status === 'Application' ? 'selected' : ''}>Application</option>
            <option value="Interview" ${job.status === 'Interview' ? 'selected' : ''}>Interview</option>
            <option value="Offer" ${job.status === 'Offer' ? 'selected' : ''}>Offer</option>
            <option value="Rejected" ${job.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </td>
        <td>
          <button class="delete-btn" data-index="${index}">Delete</button>
        </td>
      `;

      tbody.appendChild(row);
    });

    // Delete button
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        if (confirm('Are you sure you want to delete this job entry?')) {
          jobs.splice(index, 1);
          chrome.storage.local.set({ jobEntries: jobs }, renderJobs);
          showMessage("🗑️ Job deleted.", "#ef4444");
        }
      });
    });

    // Status dropdown color class update
    document.querySelectorAll('.status-select').forEach((select) => {
      select.addEventListener('change', (e) => {
        const newStatus = e.target.value;
        select.className = `status-select ${getStatusClass(newStatus)}`;
      });
    });

    // Toggle Edit/Save Button
    const toggleBtn = document.getElementById('toggleEditBtn');
    toggleBtn.textContent = editMode ? "💾 Save All" : "✏️ Edit All";
    toggleBtn.onclick = () => {
      if (editMode) {
        // Save all edits
        document.querySelectorAll('input.edit-input').forEach((input) => {
          const index = parseInt(input.dataset.index);
          const field = input.dataset.field;
          jobs[index][field] = input.value.trim();
        });

        document.querySelectorAll('.status-select').forEach((select) => {
          const index = parseInt(select.dataset.index);
          jobs[index].status = select.value;
        });

        chrome.storage.local.set({ jobEntries: jobs }, () => {
          showMessage("✅ Changes saved!", "#10b981");
          editMode = false;
          renderJobs();
        });
      } else {
        editMode = true;
        renderJobs();
      }
    };
  });
}

function getStatusClass(status) {
  return `status-color-${status.replace(/\s/g, '')}`;
}

function showMessage(text, color = "#10b981") {
  const msg = document.getElementById('statusMsg');
  msg.textContent = text;
  msg.style.backgroundColor = color + "22";
  msg.style.color = color;
  msg.classList.add('show');

  clearTimeout(msg._timeout);
  msg._timeout = setTimeout(() => {
    msg.classList.remove('show');
  }, 2000);
}

renderJobs();

document.getElementById('downloadBtn').addEventListener('click', () => {
  chrome.storage.local.get({ jobEntries: [] }, (data) => {
    const jobs = data.jobEntries || [];

    if (jobs.length === 0) {
      alert("⚠️ No job entries to download.");
      return;
    }

    const headers = [
      "No.",
      "Date",
      "Company",
      "University",
      "Location",
      "Title",
      "Documents",
      "Status",
      "Link"
    ];

    const rows = jobs.map((job, index) => [
      index + 1,
      job.date,
      job.company,
      job.university,
      job.location,
      job.title,
      job.documents,
      job.status,
      job.url
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const downloadUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "job-applications.csv";
    a.click();
  });
});

function escapeCSV(value) {
  if (typeof value !== "string") return value;
  return `"${value.replace(/"/g, '""')}"`;
}

