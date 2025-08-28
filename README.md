# Job Application Tracker Tool (Chrome Extension)

A lightweight Chrome extension that helps you track your job applications directly from job listing pages — LinkedIn, company websites, job boards, and more — with a single click.

---

## 🚀 Version 1.2 Release Notes

**What's New in Version 1.2:**

- ✅ Added support for displaying job URL links in the View panel
- ✅ Clickable hyperlinks to original job postings
- ✅ Improved CSV export with URL column
- ✅ Enhanced popup UI for capturing job URLs
- ✅ Fixed missing link bug from CSV uploads
- ✅ General code cleanup and structure improvements

---

## Features

- Extracts job title, company name, and location from job listing pages
- Automatically fills in fields in the extension popup
- Tracks application status (Application, Interview, Offer, Rejected)
- Allows editing entries in the View Applications tab
- Saves data locally using Chrome Storage (no account needed)
- Exports all saved applications to CSV
- Displays saved job URLs as clickable links
- Works entirely offline

---

## How to Install the Extension

1. Download this repository as a ZIP or clone it via Git
2. Unzip the folder (e.g., `job-application-tracker/`)
3. Open Chrome and navigate to: `chrome://extensions`
4. Enable **Developer mode** (top right)
5. Click **Load unpacked**
6. Select the unzipped folder

---

## How to Use

1. Open a job listing page
2. Click the extension icon in your toolbar
3. The popup will auto-fill available data (company, title, location, and URL)
4. Click **Save Job** to store the entry
5. Click **View Applications** to edit, delete, or export saved jobs

> **Tip:** Make sure the job listing is fully opened (not just the preview pane).

---

## How to Update the Extension Without Losing Saved Job Entries

When updating this extension manually, be sure to retain your saved job data:

1. Open Chrome and go to: `chrome://extensions`
2. **Do not click “Remove”** — this will erase all saved data
3. Open the original folder you used for loading the extension (e.g., `job-tracker/`)
4. Replace its contents with the latest version’s files
5. Back in Chrome, click the **Reload icon (🔁)** on the extension card

> This ensures Chrome uses the same extension ID and retains all previously saved entries.

### Common Mistakes to Avoid

| Action                        | Result                          |
|------------------------------|---------------------------------|
| Removing the extension       | Deletes all saved job data      |
| Loading from a new folder    | Creates a new extension ID      |
| Renaming or moving the folder| Treated as a new extension      |

---

## Backup Option (Optional)

Before updating, you may download your saved entries from the View Applications page using the **Download CSV** button.

---

## Supported Fields

- Company Name  
- Job Title  
- Location  
- University Name (optional)  
- Documents Sent  
- Application Status  
- Date of Application  
- Job Link (URL)

---

## Development & Contribution

This project uses:

- HTML, CSS, JavaScript
- Chrome Extensions API (Manifest V3)
- Chrome Storage API
- Blob API for CSV generation

Contributions are welcome! Feel free to fork this repo, open issues, or submit pull requests to improve features, compatibility, or UX.

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

## Author

**Sushant Choraghe**  
[LinkedIn Profile](https://www.linkedin.com/in/sushantchoraghe)

