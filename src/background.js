chrome.runtime.onInstalled.addListener(function() {
    var webHookUrl = "";
    var username = "";

    var webhook_is_valid = true;

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        sendResponse({});
        if (request.type == 'set_webhook_valid') {
            webhook_is_valid = request.valid;
            console.log(request, webhook_is_valid);
        }
    });

    chrome.contextMenus.create({
        id: 'sendimagetodiscord',
        title: "Send Image To Discord",
        contexts:["image"],
    });

    chrome.contextMenus.create({
        id: 'sendvideotodiscord',
        title: "Send Video To Discord",
        contexts:["video"],
    });

    chrome.contextMenus.create({
        id: 'sendaudiodiscord',
        title: "Send Audio To Discord",
        contexts:["audio"],
    });

    chrome.contextMenus.create({
        id: 'sendselectiontodiscord',
        title: "Send Selection To Discord",
        contexts:["selection"],
    });

    chrome.contextMenus.create({
        id: 'sendlinktodiscord',
        title: "Send Link To Discord",
        contexts:["link"],
    });

    chrome.contextMenus.create({
        id: 'sendpagetodiscord',
        title: "Send Page To Discord",
        contexts:["page"],
    });

    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        console.log(webHookUrl);
        if (info.menuItemId == "sendimagetodiscord") {
            sendimagetodiscord(info);
        } else if (info.menuItemId == "sendvideotodiscord") {
            sendvideotodiscord(info);
        } else if (info.menuItemId == "sendaudiotodiscord") {
            sendaudiotodiscord(info);
        } else if (info.menuItemId == "sendselectiontodiscord") {
            sendselectiontodiscord(info);
        } else if (info.menuItemId == "sendlinktodiscord") {
            sendlinktodiscord(info);
        } else if (info.menuItemId == "sendpagetodiscord") {
            sendpagetodiscord(info);
        }
    });

    function sendimagetodiscord(info) {
        postToWebhook("**" + username + "**: " + info.srcUrl);
    }
    
    function sendvideotodiscord(info) {
        postToWebhook("**" + username + "**: " + info.srcUrl);
    }

    function sendaudiotodiscord(info) {
        postToWebhook("**" + username + "**: " + info.srcUrl);
    }

    function sendselectiontodiscord(info) {
        postToWebhook("**" + username + "**: \"*" + info.selectionText + "*\" - " + info.pageUrl);
    }

    function sendlinktodiscord(info) {
        postToWebhook("**" + username + "**: " + info.linkUrl);
    }

    function sendpagetodiscord(info) {
        postToWebhook("**" + username + "**: " + info.pageUrl);
    }

    function postToWebhook(content) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', webHookUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      
        data = {
            content: content,
        }

        xhr.send(JSON.stringify(data));

        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                console.log(xhr.responseText);
            }
        };
    }

    console.log(chrome.identity.getRedirectURL());

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        sendResponse({});
        if (request.type == 'update') {
            refreshVars();
        }
    });

    function refreshVars() {
        chrome.storage.sync.get('username', function(data) {
            username = data.username;
        });
        chrome.storage.sync.get('webHookUrl', function(data) {
            webHookUrl = data.webHookUrl;
        });
    }

    refreshVars();

});