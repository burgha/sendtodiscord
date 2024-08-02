chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: 'sendimagetodiscord',
        title: "Send Image To Discord",
        contexts: ["image"],
    });

    chrome.contextMenus.create({
        id: 'sendvideotodiscord',
        title: "Send Video To Discord",
        contexts: ["video"],
    });

    chrome.contextMenus.create({
        id: 'sendaudiodiscord',
        title: "Send Audio To Discord",
        contexts: ["audio"],
    });

    chrome.contextMenus.create({
        id: 'sendselectiontodiscord',
        title: "Send Selection To Discord",
        contexts: ["selection"],
    });

    chrome.contextMenus.create({
        id: 'sendlinktodiscord',
        title: "Send Link To Discord",
        contexts: ["link"],
    });

    chrome.contextMenus.create({
        id: 'sendpagetodiscord',
        title: "Send Page To Discord",
        contexts: ["page"],
    });
});

let webHookUrl = "";
let username = "";

let webhook_is_valid = true;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    sendResponse({});
    if (request.type === 'set_webhook_valid') {
        webhook_is_valid = request.valid;
        console.log(request, webhook_is_valid);
    } else if (request.type === 'update') {
        refreshVars();
    }
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    switch (info.menuItemId) {
        case "sendimagetodiscord":
            sendimagetodiscord(info);
            break;
        case "sendvideotodiscord":
            sendvideotodiscord(info);
            break;
        case "sendaudiotodiscord":
            sendaudiotodiscord(info);
            break;
        case "sendselectiontodiscord":
            sendselectiontodiscord(info);
            break;
        case "sendlinktodiscord":
            sendlinktodiscord(info);
            break;
        case "sendpagetodiscord":
            sendpagetodiscord(info);
            break;
    }
});

async function postToWebhook(content) {
    try {
        const response = await fetch(webHookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ content: content })
        });

        if (response.ok) {
            console.log('Posted to Discord');
        } else {
            console.error('Failed to post to Discord', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error posting to Discord', error);
    }
}

function sendimagetodiscord(info) {
    postToWebhook(`**${username}**: ${info.srcUrl}`);
}

function sendvideotodiscord(info) {
    postToWebhook(`**${username}**: ${info.srcUrl}`);
}

function sendaudiotodiscord(info) {
    postToWebhook(`**${username}**: ${info.srcUrl}`);
}

function sendselectiontodiscord(info) {
    postToWebhook(`**${username}**: "*${info.selectionText}*" - ${info.pageUrl}`);
}

function sendlinktodiscord(info) {
    postToWebhook(`**${username}**: ${info.linkUrl}`);
}

function sendpagetodiscord(info) {
    postToWebhook(`**${username}**: ${info.pageUrl}`);
}

function refreshVars() {
    chrome.storage.sync.get(['username', 'webHookUrl'], function(data) {
        username = data.username || '';
        webHookUrl = data.webHookUrl || '';
        console.log("username:", username);
        console.log("url:", webHookUrl);
    });
}

refreshVars();
