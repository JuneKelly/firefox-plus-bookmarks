// popup js

(function () {
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
    browser.runtime.openOptionsPage();
    window.close();
  };

  browser.storage.local.get('email').then(
    function resultHandler(result) {
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

      var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
      gettingActiveTab.then((tabs) => {
        if (tabs[0]) {
          // done loading
          showPreviewPanel();

          title = tabs[0].title;
          url = tabs[0].url;

          titleElement.innerText = title;
          urlElement.innerText = url;

          var encodedTitle = encodeURI(title);
          var encodedUrl = encodeURI(url);
          mailLink.href = (
            'mailto:'+targetAddress+'?subject='+encodedTitle+'&body='+encodedUrl
          );
        }
      });

    },
    function errorHandler(e) {
      showErrorPanel(e.message);
    }
  );

})();
