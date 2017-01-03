// popup js

(function () {
  var loading = document.getElementById('loading');
  var panel = document.getElementById('panel');
  var setupHint = document.getElementById('setup-hint');

  document.getElementById('open-settings').onclick = function(e) {
    e.preventDefault();
    browser.runtime.openOptionsPage();
    window.close();
  };

  browser.storage.local.get('email').then(
    function(result) {
      var targetAddress = result.email;
      if (!targetAddress) {
        setupHint.style.display = 'inherit';
        loading.style.display = 'none';
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
          loading.style.display = 'none';
          setupHint.style.display = 'none';
          panel.style.display = 'inherit';

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
    function error() {
      setupHint.style.display = 'inherit';
      loading.style.display = 'none';
    }
  );

})();
