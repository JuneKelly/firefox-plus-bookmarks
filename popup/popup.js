// popup js

(function () {
  window.onerror = function (e) {
    document.querySelector('body').innerText = 'ERROR! ' + e;
  };

  var panels = function () {

    var errorPanel = document.getElementById('error-panel');
    var errorMessage = document.getElementById('error-message');
    /* 
      UNUSED panel object loadingPanel:
      removed but still used as default starting panel
      (see activePanel initialization);
    // var loadingPanel = document.getElementById('loading-panel');
    */
    var previewPanel = document.getElementById('preview-panel');
    var setupHint = document.getElementById('setup-hint');
    var settingsLink = document.getElementById('open-settings');

    var activePanel = document.getElementById('loading-panel');
    togglePanel(activePanel);

    var showErrorPanel = function (message) {
      message = message || 'Something went wrong :('
      togglePanel(errorPanel, message);
    };

    var showPreviewPanel = function () {
      togglePanel(previewPanel);
    };

    var showSetupHint = function () {
      togglePanel(setupHint);
    };

    function togglePanel(panel, message) {
      if (activePanel != panel || activePanel.style.display == 'none') {
        activePanel.style.display = 'none';
        panel.style.display = 'inherit';
        activePanel = panel;

        if (panel == errorPanel) {
          errorMessage.innerText = message;
        }
      }
    }

    settingsLink.onclick = function settingsLinkClickHandler(e) {
      e.preventDefault();
      browser.runtime.openOptionsPage();
      window.close();
    };

    return {
      showError: showErrorPanel,
      showPreview: showPreviewPanel,
      showSetupHint: showSetupHint
    }
  }();

  browser.storage.local.get('email').then(
    function resultHandler(result) {
      var targetAddress = result.email;
      if (!targetAddress) {
        panels.showSetupHint();
        return;
      }
      var url = null;
      var title = null;

      var titleElement = document.getElementById('title');
      var urlElement = document.getElementById('url');
      var mailLink = document.getElementById('mail-link');

      var gettingActiveTab = browser.tabs.query({
        active: true,
        currentWindow: true
      });
      gettingActiveTab.then((tabs) => {
        if (tabs[0]) {
          // done loading
          panels.showPreview();

          title = tabs[0].title;
          url = tabs[0].url;

          titleElement.innerText = title;
          urlElement.innerText = url;

          var encodedTitle = encodeURI(title);
          var encodedUrl = encodeURI(url);
          mailLink.href = (
            'mailto:' + targetAddress + '?subject=' + encodedTitle + '&body=' + encodedUrl
          );
        }
      });

    },
    function errorHandler(e) {
      panels.showError(e.message);
    }
  );

})();