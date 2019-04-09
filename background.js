chrome.runtime.onInstalled.addListener(function() {
    var webHookUrl = "";

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
        chrome.storage.sync.get('webHookUrl', function(data) {
            if ('webHookUrl' in data) {
                webHookUrl = data.webHookUrl;
            }
        });

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

    }
    
    function sendvideotodiscord(info) {

    }

    function sendaudiotodiscord(info) {

    }

    function sendselectiontodiscord(info) {

    }

    function sendlinktodiscord(info) {

    }

    function sendpagetodiscord(info) {

    }

    console.log(chrome.identity.getRedirectURL());
});