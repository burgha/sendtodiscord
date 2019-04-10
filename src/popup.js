var loggedin = false;
var username;

chrome.storage.sync.get(['username', 'webHookInfo', 'webHookUrl'], function(data) {
    username = data.username;
    if('webHookUrl' in data) {
        document.getElementById("webHookUrl").value = data.webHookUrl;
    }
    if('webHookInfo' in data) {
        document.getElementById('webHookInfo').innerHTML = data.webHookInfo;
    }
});

function checkLoginStatus() {
    chrome.storage.sync.get('discord_token', function(data) {
        document.getElementById("login_status").value = data;
        if ('discord_token' in data) {
            getUsername(data.discord_token.access_token);
            loggedin = true;
            document.getElementById("loginwithdiscord").innerHTML = "Logout";
            document.getElementById("login_status").innerHTML = username;
            document.getElementById("settings").style.visibility = "visible";
            document.getElementById("saveSettings").style.visibility = "visible";
            document.getElementById("login").classList.remove('notloggedin');
            document.getElementById("login").classList.add('loggedin');
        } else {
            loggedin = false;
            document.getElementById("loginwithdiscord").innerHTML = "Login with Discord";
            document.getElementById("login_status").innerHTML = "";
            document.getElementById("settings").style.visibility = "hidden";
            document.getElementById("saveSettings").style.visibility = "hidden";
            document.getElementById("login").classList.remove('loggedin');
            document.getElementById("login").classList.add('notloggedin');
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
            chrome.storage.sync.set({ username: JSON.parse(xhr.responseText).username }, function() {
                chrome.runtime.sendMessage({type: 'update',  update: 1}, function(response) {
                });
            });
            document.getElementById("login_status").innerHTML = JSON.parse(xhr.responseText).username;
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

document.getElementById("saveSettings").addEventListener("click", function(){
    chrome.storage.sync.remove(['webHookInfo'], function() {
        chrome.storage.sync.set({ webHookUrl: document.getElementById("webHookUrl").value }, function() {
            chrome.runtime.sendMessage({type: 'update',  update: 1}, function(response) {
            });
            getGuildInfo();
        });
    });
});

document.getElementById("loginwithdiscord").addEventListener("click", function(){
    if (loggedin) {
        logout();
    } else {
        login();
    }
});

function login() {
    var url = "https://discordapp.com/api/oauth2/authorize?client_id=564897958210961427&redirect_uri=" + chrome.identity.getRedirectURL() + "&response_type=code&scope=identify%20guilds";
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

function getGuildInfo() { 
    chrome.runtime.sendMessage({type: 'set_webhook_valid',  valid: false}, function(response) {
    });
    document.getElementById('webHookInfo').innerHTML = "";
    chrome.storage.sync.get('webHookUrl', function(data) {
        if ('webHookUrl' in data) {
            var xhr = new XMLHttpRequest();
            
            xhr.open("GET", data.webHookUrl, true);
            xhr.send();
            
            xhr.onload = function (e) {
                if (xhr.readyState === 4) {
                    chrome.storage.sync.get('discord_token', function(data) {
                        if ('discord_token' in data) {
                            if (xhr.status === 200 && xhr.getResponseHeader('content-type') === 'application/json' && 'name' in JSON.parse(xhr.responseText)) {
                                chrome.extension.getBackgroundPage().console.log('valid');
                                chrome.runtime.sendMessage({type: 'set_webhook_valid',  valid: true}, function(response) {
                                });
                                var guild_id = JSON.parse(xhr.responseText).guild_id;
                                var webHookId = JSON.parse(xhr.responseText).id;
                                var webHookAvatar = JSON.parse(xhr.responseText).avatar;
                                var webHookName = JSON.parse(xhr.responseText).name;
                                var xhr2 = new XMLHttpRequest();
                        
                                xhr2.open("GET", "https://discordapp.com/api/users/@me/guilds", true);
                                xhr2.setRequestHeader('Authorization', 'Bearer ' + data.discord_token.access_token);
                                chrome.extension.getBackgroundPage().console.log(xhr2.responseText);
                                xhr2.send();
                                
                                xhr2.onload = function (e) {
                                    if (xhr2.readyState === 4) {
                                        chrome.extension.getBackgroundPage().console.log(xhr2.responseText);
                                        var guilds = JSON.parse(xhr2.responseText);
                                        guilds.forEach(element => {
                                            if (element.id == guild_id) {
                                                chrome.extension.getBackgroundPage().console.log(element.name);
                                                var info = "<p><span class='bold'>Webhook erkannt:</span></p> <br> <img id='avatar' src='https://cdn.discordapp.com/avatars/"+ webHookId +" / "+ webHookAvatar +".png'>" + '<p id="webHookName">' + element.name + "/" + webHookName + "</p>";
                                                chrome.storage.sync.set({ webHookInfo: info }, function() {
                                                });
                                                document.getElementById('webHookInfo').innerHTML = info;
                                            }
                                        });                      
                                    }
                                };
                            } else {
                                chrome.extension.getBackgroundPage().console.log('invalid');
                                document.getElementById('webHookInfo').innerHTML = "";
                                chrome.runtime.sendMessage({type: 'set_webhook_valid',  valid: false}, function(response) {
                                });
                            }
                        }
                    });
                }
            };

            xhr.onerror = function(e) {
                chrome.extension.getBackgroundPage().console.log('invalid');
                document.getElementById('webHookInfo').innerHTML = "";
                chrome.runtime.sendMessage({type: 'set_webhook_valid',  valid: false}, function(response) {
                });
            }
        }
    });
}

getGuildInfo();