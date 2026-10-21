(function () {
  const form = document.querySelector('form');
  if (!form) return;
  const upload = document.getElementById('documents');
  const notice = document.getElementById('file-notice');
  upload.addEventListener('change', () => {
    notice.textContent = '';
    if (upload.files[0] && upload.files[0].size > 10000000) {
      upload.value = '';
      notice.textContent = 'That file is larger than 10 MB. You can still submit your application without it and share your documents later.';
    }
  });
  form.addEventListener('submit', () => {
    // Optional answers stay optional. No eligibility or completeness gate.
    const id = form.elements.namedItem('application_id');
    if (!id.value) {
      id.value = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
      form.elements.namedItem('submitted_at').value = new Date().toISOString();
    }
    const email = form.elements.namedItem('applicant_email').value.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      let replyTo = form.elements.namedItem('_replyto');
      if (!replyTo) { replyTo = document.createElement('input'); replyTo.type = 'hidden'; replyTo.name = '_replyto'; form.appendChild(replyTo); }
      replyTo.value = email;
    } else { form.elements.namedItem('_replyto')?.remove(); }
    document.getElementById('submit-status').textContent = 'Sending your application…';
    const button = form.querySelector('button[type=submit]');
    button.disabled = true;
    button.textContent = 'Sending…';
    // Do not prevent native POST: FormSubmit keeps the email record and optional file.
  });
  window.addEventListener('pageshow', () => {
    form.elements.namedItem('application_id').value = '';
    form.elements.namedItem('submitted_at').value = '';
    const button = form.querySelector('button[type=submit]');
    button.disabled = false;
    button.textContent = 'Submit';
    document.getElementById('submit-status').textContent = '';
  });
})();
