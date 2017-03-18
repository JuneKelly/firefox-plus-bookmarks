// popup js

(function () {
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
  window.onerror = function(e) {
    document.querySelector('body').innerText = 'ERROR! '+e;
  };

  var errorPanel = document.getElementById('error-panel');
  var errorMessage = document.getElementById('error-message');
  var loadingPanel = document.getElementById('loading-panel');
  var previewPanel = document.getElementById('preview-panel');
  var setupHint = document.getElementById('setup-hint');
  var settingsLink = document.getElementById('open-settings');

  var showErrorPanel = function(message) {
    errorMessage.innerText = message || 'Something went wrong :(';
    errorPanel.style.display = 'inherit';
    loadingPanel.style.display = 'none';
    setupHint.style.display = 'none';
    previewPanel.style.display = 'none';
  };

  var showPreviewPanel = function() {
    errorPanel.style.display = 'none';
    loadingPanel.style.display = 'none';
    setupHint.style.display = 'none';
    previewPanel.style.display = 'inherit';
  };

  var showSetupHint = function() {
    errorPanel.style.display = 'none';
    loadingPanel.style.display = 'none';
    setupHint.style.display = 'inherit';
    previewPanel.style.display = 'none';
  };

  settingsLink.onclick = function settingsLinkClickHandler(e) {
    e.preventDefault();
    _browser.runtime.openOptionsPage();
    window.close();
  };

  _browser.storage.local.get(
    'email',
    function(result) {
      var targetAddress = result.email;
      if (!targetAddress) {
        showSetupHint();
        return;
      }
      var url = null;
      var title = null;

      var titleElement = document.getElementById('title');
      var urlElement = document.getElementById('url');
      var mailLink = document.getElementById('mail-link');

      _browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
          // done loading
          showPreviewPanel();

          title = tabs[0].title;
          url = tabs[0].url;

          titleElement.innerText = title;
          urlElement.innerText = url;

          var encodedTitle = encodeURI(title);
          var encodedUrl = encodeURI(url);
          var mailToLink = 'mailto:'+targetAddress+'?subject='+encodedTitle+'&body='+encodedUrl;
          mailLink.href = mailToLink;
          var debug = document.getElementById('debug');
          debug.innerText = mailLink.href;

          mailLink.onclick = (e) => {
            e.preventDefault();
            _browser.tabs.create({url: mailToLink, active: false}, (tab) => {
              var timeoutInMs = 1000;
              setTimeout(
                function() {
                  chrome.tabs.remove(tab.id);
                },
                timeoutInMs
              );
            });
          };
        }
      });

    }
  );

})();
