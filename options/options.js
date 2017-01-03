function saveOptions(e) {
  browser.storage.local.set({
    email: document.querySelector("#email").value
  });
  var successMessage = document.getElementById('success-message');
  successMessage.style.display = 'inherit';
  e.preventDefault();
}

function restoreOptions() {
  var gettingItem = browser.storage.local.get('email');
  gettingItem.then((res) => {
    document.querySelector("#email").value = res.email || '';
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
