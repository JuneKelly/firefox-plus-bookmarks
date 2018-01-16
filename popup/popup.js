// popup js

(function () {
  window.onerror = function (e) {
    document.querySelector('body').innerText = 'ERROR! ' + e;
  };

  var panels = function () {

    var errorPanel = function () {
      var _panel = document.getElementById('error-panel');
      var errorMessage = document.getElementById('error-message');
      return {
        show: function (message) {
          errorMessage.innerText = message || 'Something went wrong :(';
          togglePanel(_panel);
        }
      }
    }();

    /* 
      UNUSED panel object loadingPanel:
      removed but still used as default starting panel
      (see activePanel initialization);
    // var loadingPanel = document.getElementById('loading-panel');
    */

    var previewPanel = function () {
      var _panel = document.getElementById('preview-panel');
      var titleElement = document.getElementById('title');
      var urlElement = document.getElementById('url');
      var mailLink = document.getElementById('mail-link');

      return {
        show: function (targetAddress, title, url) {
          titleElement.innerText = title;
          urlElement.innerText = url;

          var encodedTitle = encodeURI(title);
          var encodedUrl = encodeURI(url);
          mailLink.href = (
            'mailto:' + targetAddress + '?subject=' + encodedTitle + '&body=' + encodedUrl
          );

          togglePanel(_panel);
        }
      }
    }();

    var setupHint = function () {
      _panel = document.getElementById('setup-hint');
      var settingsLink = document.getElementById('open-settings');
      settingsLink.onclick = function settingsLinkClickHandler(e) {
        e.preventDefault();
        browser.runtime.openOptionsPage();
        window.close();
      };
      return {
        show: function () {
          togglePanel(_panel);
        }
      }
    }();

    var activePanel = document.getElementById('loading-panel');
    togglePanel(activePanel);

    function togglePanel(panel) {
      if (activePanel != panel || activePanel.style.display == 'none') {
        activePanel.style.display = 'none';
        panel.style.display = 'inherit';
        activePanel = panel;
      }
    }

    return {
      showError: errorPanel.show,
      showPreview: previewPanel.show,
      showSetupHint: setupHint.show
    }
  }();

  browser.storage.local.get('email').then(
    function resultHandler(result) {
      var targetAddress = result.email;
      if (!targetAddress) {
        panels.showSetupHint();
        return;
      }

      var gettingActiveTab = browser.tabs.query({
        active: true,
        currentWindow: true
      });
      gettingActiveTab.then((tabs) => {
        if (tabs[0]) {
          // done loading

          let title = tabs[0].title;
          let url = tabs[0].url;

          panels.showPreview(targetAddress, title, url);
        }
      });

    },
    function errorHandler(e) {
      panels.showError(e.message);
    }
  );

})();