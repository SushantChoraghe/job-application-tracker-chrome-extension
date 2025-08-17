function renderJobs() {
  chrome.storage.local.get(['jobApplications'], (result) => {
    const jobs = result.jobApplications || [];
    const tbody = document.querySelector('#jobsTable tbody');
    tbody.innerHTML = '';

    jobs.forEach((job, index) => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${job.company}</td>
        <td>${job.title}</td>
        <td>${job.location}</td>
        <td>
          <select class="status-select" data-index="${index}">
            <option value="Application" ${job.status === 'Application' ? 'selected' : ''}>Application</option>
            <option value="Interview" ${job.status === 'Interview' ? 'selected' : ''}>Interview</option>
            <option value="Rejected" ${job.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </td>
        <td><button class="delete-btn" data-index="${index}">Delete</button></td>
      `;

      tbody.appendChild(row);
    });

    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        if (confirm('Are you sure you want to delete this job entry?')) {
          jobs.splice(index, 1);
          chrome.storage.local.set({ jobApplications: jobs }, renderJobs);
        }
      });
    });

    document.querySelectorAll('.status-select').forEach((select) => {
      select.addEventListener('change', (e) => {
        const index = parseInt(e.target.dataset.index);
        jobs[index].status = e.target.value;
        chrome.storage.local.set({ jobApplications: jobs });
      });
    });
  });
}

renderJobs();
