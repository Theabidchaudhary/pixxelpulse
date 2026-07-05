(function(){
  const form = document.getElementById("footer-form");
  const alertBox = document.getElementById("footer-alert");
  if (!form) return;

  function showAlert(msg, ok=false) {
    if (!alertBox) return;
    alertBox.textContent = msg || "";
    alertBox.style.color = ok ? "#00c900" : "#ff0000";
    alertBox.style.fontWeight = "600";
    alertBox.style.textTransform = "uppercase";
    alertBox.style.marginTop = "8px";
  }

  form.addEventListener("submit", function(e) {
    e.preventDefault();      // ✅ stop reload
    e.stopImmediatePropagation(); // ✅ stop other scripts from hijacking
    e.stopPropagation();

    const message = form.querySelector("[name='message']").value.trim();
    if (!message) {
      showAlert("Message cannot be empty.");
      return false;
    }

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { "X-Requested-With": "XMLHttpRequest" }
    })
    .then(res => res.json().catch(() => null))
    .then(data => {
      if (data && data.ok) {
        showAlert(data.message || "Message sent successfully!", true);
        form.reset();
      } else {
        showAlert((data && data.message) || "Something went wrong.");
      }
    })
    .catch(() => showAlert("Network error. Please try again."));

    return false; // ✅ extra safety
  });
})();




(function(){
  const form = document.getElementById('contact-form');
  if (!form) return;

  const alertBox = document.getElementById('form-alert');
  const submitBtn = form.querySelector('button[type="submit"]');
  const t1 = submitBtn?.querySelector('.text-one');
  const t2 = submitBtn?.querySelector('.text-two');

  function setLoading(b){
    if (!submitBtn) return;
    submitBtn.disabled = b;
    if (t1) t1.textContent = b ? 'Sending...' : 'Submit';
    if (t2) t2.textContent = b ? 'Sending...' : 'Submit';
  }
  function showAlert(msg, ok=false){
    if (!alertBox) return;
    alertBox.textContent = msg || '';
    alertBox.style.display = "block";
    alertBox.style.lineHeight = "24px";
    alertBox.style.padding = "0px 10px 12px";
    alertBox.style.margin = "0";
    alertBox.style.fontSize = "15px";
    alertBox.style.fontWeight = "700";
    alertBox.style.color = ok ? '#00c900' : '#ff0000';
  }

  form.addEventListener('submit', async function(e){
    e.preventDefault();

    const phoneEl     = form.querySelector('[name="phone"]');
    const serviceEl   = form.querySelector('[name="service"]');
    const serviceErr  = form.querySelector('.service-error');
    const phoneOk     = /^\+[0-9]{7,15}$/.test((phoneEl?.value||'').trim());
    const serviceOk   = serviceEl && serviceEl.value && serviceEl.value !== '';

    // Apply phone validation
    if (phoneEl) {
      phoneEl.setCustomValidity(phoneOk ? '' : 'Use +CountryCode Then Number, e.g. +923001234567');
    }

    // Apply service validation with inline error
    if (!serviceOk) {
      serviceEl.setCustomValidity(' ');
      if (serviceErr) {
        serviceErr.textContent = 'Please select a service';
        serviceErr.style.display = 'block';
      }
    } else {
      serviceEl.setCustomValidity('');
      if (serviceErr) {
        serviceErr.textContent = '';
        serviceErr.style.display = 'none';
      }
    }

    const valid = form.checkValidity();

    if (!valid) {
      form.reportValidity(); // will point to first invalid field
      return;
    }

    setLoading(true);
    showAlert('');

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {'X-Requested-With':'XMLHttpRequest','Accept':'application/json'}
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        showAlert(data.message || 'Thanks! Your message was sent. We will be in touch very soon.', true);
        form.reset();
        if (serviceErr) {
          serviceErr.textContent = '';
          serviceErr.style.display = 'none';
        }
      } else {
        const msg = (data && (data.message || (data.errors && Object.values(data.errors).join(' ')))) || 'Sorry, something went wrong.';
        showAlert(msg);
      }
    } catch (err) {
      showAlert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  });
})();