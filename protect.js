(function () {
  // Values injected into DOM via JS — not in HTML source.
  // Discourages basic scrapers that only parse static HTML.

  var PROTECTED = {
    'email-link': {
      href:  'bWFpbHRvOmNhdGFsaW5AcGxlc3UubmV0',
      label: 'Y2F0YWxpbkBwbGVzdS5uZXQ='
    },
    'telegram-link': {
      href:  'aHR0cHM6Ly90Lm1lL2NhdGFsaW5wbGVzdQ==',
      label: 'QGNhdGFsaW5wbGVzdQ=='
    },
    'resume-link': {
      href:  'YXNzZXRzL3Jlc3VtZS5wZGY='
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    Object.keys(PROTECTED).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.href = atob(PROTECTED[id].href);
      if (PROTECTED[id].label) {
        var span = el.querySelector('.contact-value');
        if (span) span.textContent = atob(PROTECTED[id].label);
      }
    });
  });
})();
