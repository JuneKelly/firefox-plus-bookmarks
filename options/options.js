var _browser = null;
if (typeof browser !== 'undefined') {
    _browser = browser;
  }
if (typeof chrome !== 'undefined') {
  _browser = chrome;
}
if (_browser === null) {
  throw new Error("Can't initialize");
}

function saveOptions(e) {
  _browser.storage.local.set({
    email: document.querySelector("#email").value
  }, function() {
    var successMessage = document.getElementById('success-message');
    successMessage.style.display = 'inherit';
    e.preventDefault();
  });
}

function restoreOptions() {
  _browser.storage.local.get('email', function(result) {
    document.querySelector('#email').value = result.email || '';
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
