chrome.storage.sync.get('webHookUrl', function(data) {
    if ('webHookUrl' in data) {
        document.getElementById("webHookUrl").value = data.webHookUrl;
    }
});

document.getElementById("saveSettings").addEventListener("click", function(){
    chrome.storage.sync.set({ webHookUrl: document.getElementById("webHookUrl").value, username: document.getElementById("username").value });
});

document.getElementById("loginwithdiscord").addEventListener("click", function(){
    var uri = "https://discordapp.com/api/oauth2/authorize?client_id=564897958210961427&redirect_uri=https%3A%2F%2Foauth.hburger.space%2F&response_type=code&scope=identify";
    chrome.windows.create({'url': uri, 'type': 'popup'}, function(window) {
    });
});