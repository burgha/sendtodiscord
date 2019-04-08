chrome.runtime.sendMessage({type: 'auth', token: window.location.search.substr(6)}, function(response) {
});