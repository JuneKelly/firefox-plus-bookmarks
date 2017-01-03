// popup js

var loading = document.getElementById('loading');
var panel = document.getElementById('panel');

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
    panel.style.display = 'inherit';

    title = tabs[0].title;
    url = tabs[0].url;

    titleElement.innerText = title;
    urlElement.innerText = url;

    encodedTitle = encodeURI(title);
    encodedUrl = encodeURI(url);
    mailLink.href = (
      'mailto:shane+bookmarks@kilkelly.me?subject='+encodedTitle+'&body='+encodedUrl
    );
  }
});
