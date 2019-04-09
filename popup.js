var loggedin = false;
var username;

chrome.storage.sync.get('username', function(data) {
    username = data.username;
});

function checkLoginStatus() {
    chrome.storage.sync.get('discord_token', function(data) {
        document.getElementById("login_status").value = data;
        if ('discord_token' in data) {
            getUsername(data.discord_token.access_token);
            loggedin = true;
            document.getElementById("loginwithdiscord").innerHTML = "Logout";
            document.getElementById("login_status").innerHTML = "Status: Eingeloggt als " + username;
        } else {
            loggedin = false;
            document.getElementById("loginwithdiscord").innerHTML = "Login";
            document.getElementById("login_status").innerHTML = "Status: nicht eingeloggt";
        }
    });
}

checkLoginStatus();

function getUsername(token) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "https://discordapp.com/api/users/@me", true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.send();
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            chrome.storage.sync.set({ username: JSON.parse(xhr.responseText).username });
            document.getElementById("login_status").innerHTML = "Status: Eingeloggt als " + JSON.parse(xhr.responseText).username;
            username = JSON.parse(xhr.responseText).username;
        }
    };
}

function getToken(code) {
    var xhr = new XMLHttpRequest();
    
    xhr.open("POST", "https://discordapp.com/api/oauth2/token", true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send("client_id=564897958210961427&client_secret=6DU7Kptjfv975HIt6-P_QuajUjT4Aq-W&code=" + code + "&redirect_uri=" + chrome.identity.getRedirectURL() + "&scope=identify&grant_type=authorization_code");
    
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            chrome.storage.sync.set({ discord_token: JSON.parse(xhr.responseText)}, function() {
                checkLoginStatus();
            });
        }
    };
}

chrome.storage.sync.get('webHookUrl', function(data) {
    if ('webHookUrl' in data) {
        document.getElementById("webHookUrl").value = data.webHookUrl;
    }
});

document.getElementById("saveSettings").addEventListener("click", function(){
    chrome.storage.sync.set({ webHookUrl: document.getElementById("webHookUrl").value });
});

document.getElementById("loginwithdiscord").addEventListener("click", function(){
    if (loggedin) {
        logout();
    } else {
        login();
    }
});

function login() {
    var url = "https://discordapp.com/api/oauth2/authorize?client_id=564897958210961427&redirect_uri=" + chrome.identity.getRedirectURL() + "&response_type=code&scope=identify";
    chrome.identity.launchWebAuthFlow({url: url, interactive: true}, function(res){
        var url = new URL(res);
        var code = url.searchParams.get("code");
        getToken(code);
    });
}

function logout() {
    chrome.storage.sync.remove('discord_token', function() {
        checkLoginStatus();
    });
}