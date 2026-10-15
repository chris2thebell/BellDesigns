# Contact form — Google Apps Script setup

The contact page (`contact.html` + `contact.js`) posts to the existing Apps Script web app. The browser sends JSON as `text/plain` so Apps Script does not have to answer a CORS preflight. Uploaded files are included as base64 and are not sent as multipart file parts.

Current web app URL, in `contact.js` as `SCRIPT_URL`:

```
https://script.google.com/macros/s/AKfycbyO7gDrsAwO265p3rIMneCglMc-9O7GbAPFjneSVvDWvPMVOuoiQJptZTKVzjQRqZlF/exec
```

The script below replaces the old form handler. Until this version is deployed, the page shows a fallback that asks the visitor to call (385) 484-8775 or email belldesignsutah@gmail.com. It does not show a raw `alert()`.

The page refuses more than 4 files or 8 MB total before it tries to send.

## What the script does

1. Reads the JSON body (`name`, `email`, `phone`, `role`, `projectType`, `city`, `message`, `files`).
2. Saves each file to a Google Drive folder named `Bell Designs Utah Contact Uploads` (created on the first upload, in the My Drive of the account that owns the script).
3. Emails `belldesignsutah@gmail.com` with the lead details and the Drive links. Reply-To is the visitor’s email.

## Setup steps

1. Open [script.google.com](https://script.google.com) while signed in as the Google account that should own the Drive files and send the mail. Use `belldesignsutah@gmail.com` if that is the account that already owns the deployment above.
2. Open the existing project behind that `/exec` URL if you can. Otherwise create a project named `Bell Designs contact form`.
3. Replace `Code.gs` with the script in the next section. Save.
4. Click **Deploy → Manage deployments**.
   - If this project already has the deployment whose URL matches `SCRIPT_URL`: edit it (pencil icon), choose **New version**, set **Execute as: Me** and **Who has access: Anyone**, then **Deploy**. The URL stays the same, so `contact.js` does not change.
   - If you created a new project: **Deploy → New deployment → Web app**, with the same two settings. Copy the URL that ends in `/exec` and paste it into the `SCRIPT_URL` constant at the top of `contact.js`.
5. The first deploy asks you to authorize Gmail (send email as you) and Drive (create and edit files). Approve that prompt while signed in as the same account.
6. Access must be **Anyone**, not “Anyone with a Google account.” A signed-in-only web app rejects the website.
7. Submit a test from the contact page, including one small PDF or image. You should see “Thank you. Your note is in…” on the page, an email at `belldesignsutah@gmail.com`, and the file in Drive under `Bell Designs Utah Contact Uploads`.
8. If the page shows the call-or-email fallback instead, the live deployment is still the old script or `SCRIPT_URL` does not match. Deploy a new version and check the URL. Do not look for a browser `alert()`; the message is on the page.

Consumer Gmail accounts can send on the order of 100 Apps Script emails per day. The form’s 8 MB cap stays under the request size Apps Script will accept, with room for base64 expansion.

## Code.gs

```javascript
/**
 * Bell Designs Utah contact form.
 * Deploy as a web app: Execute as Me, Who has access: Anyone.
 * POST body is JSON (Content-Type text/plain).
 * files[]: { filename, mimeType, base64 }
 */

var NOTIFY_EMAIL = 'belldesignsutah@gmail.com';
var DRIVE_FOLDER_NAME = 'Bell Designs Utah Contact Uploads';

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents ? e.postData.contents : '';
    var data = JSON.parse(raw);
    var folder = getOrCreateFolder_(DRIVE_FOLDER_NAME);
    var links = saveFiles_(folder, data);
    sendEmail_(data, links);
    return json_({ status: 'success' });
  } catch (err) {
    return json_({ status: 'error', message: String(err) });
  }
}

function doGet() {
  return ContentService.createTextOutput('Bell Designs contact endpoint is running.');
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateFolder_(name) {
  var folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(name);
}

function saveFiles_(folder, data) {
  var links = [];
  var files = data.files || [];
  var stamp = Utilities.formatDate(new Date(), 'America/Denver', 'yyyy-MM-dd_HHmmss');
  var who = String(data.name || 'lead').replace(/[^\w\-]+/g, '_').slice(0, 40);

  files.forEach(function (file, i) {
    if (!file || !file.base64) {
      return;
    }
    var bytes = Utilities.base64Decode(file.base64);
    var safeName = String(file.filename || ('file-' + i)).replace(/[^\w.\-]+/g, '_');
    var blob = Utilities.newBlob(bytes, file.mimeType || 'application/octet-stream', safeName);
    var created = folder.createFile(blob);
    created.setName(stamp + '_' + who + '_' + safeName);
    links.push(created.getUrl());
  });

  return links;
}

function sendEmail_(data, links) {
  var subject = 'New website lead: ' + (data.role || 'Unknown') +
    ' — ' + (data.projectType || 'Project') +
    ' (' + (data.city || 'Utah') + ')';

  var body = [
    'New contact form submission from belldesignsutah.com',
    '',
    'Name: ' + (data.name || ''),
    'Email: ' + (data.email || ''),
    'Phone: ' + (data.phone || ''),
    'I am a: ' + (data.role || ''),
    'Project type: ' + (data.projectType || ''),
    'City: ' + (data.city || ''),
    '',
    'Message:',
    data.message || '',
    '',
    'Files saved to Drive:',
    links.length ? links.join('\n') : '(none)'
  ].join('\n');

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: data.email || NOTIFY_EMAIL,
    subject: subject,
    body: body
  });
}
```
