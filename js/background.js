console.log("I'm backgroud (#^.^#)");

var name = "";
var phone = "";
var address = "";

var canUse = false;
//测试是否登录
chrome.storage.sync.get({
    username: '未登录',
    password: ''
}, function (items) {
    if (items.username == "未登录") {
        promptUser("未登录");
    } else {
        doLogin(items.username, items.password);
    }
});

//接收消息
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        //拼多多js接收到popupjs的指令之后会向background js发送这样一个请求,存储用户信息
        switch (request.type) {
            case "option_login_success":
                canUse = true;
                sendResponse({farewell: "success"});
                break;
            case "popup_taobao_click":
                if (canUse == false) {
                    //当前不可用,
                    sendResponse({farewell: "fail", canUse: false});
                } else {
                    tellTaoBaoSetUserInfo();
                    sendResponse({farewell: "success"});
                }
                break;
            case "popup_pinduoduo_click":
                if (canUse == false) {
                    //当前不可用,
                    sendResponse({farewell: "fail", canUse: false});
                } else {
                    tellPinGetUserInfo();
                    sendResponse({farewell: "success"});
                }
                break;
        }

    });

//接受键盘快捷键
chrome.commands.onCommand.addListener(function (command) {
    if (canUse == false) {
        console.log("已经过期了,请及时充值.\n谢谢您的支持(#^.^#)");
        return
    }
    if (command.valueOf() == "getUserInfo") {
        tellPinGetUserInfo();
    } else if (command.valueOf() == "setUserInfo") {
        tellTaoBaoSetUserInfo();
    }
});

function tellTaoBaoSetUserInfo() {
    //给 taobao.js发送一个消息,
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            type: "background_setUserInfo",
            name: name,
            phone: phone,
            address: address
        }, function (response) {
            console.log(response.farewell);
        });
    });
}

function tellPinGetUserInfo() {
    //需要给 pinduoduo.js 发送消息,来获取用户信息
    console.log("getUserInfo");
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "background_getUserInfo"}, function (response) {
            name = response.name;
            phone = response.phone;
            address = response.address;

            console.log(name);
            console.log(phone);
            console.log(address);
        });
    });
}


function doLogin(username, password) {
    //构建get url
    var loginUrl = "http://localhost:8989"
        + "/login"
        + "?username=" + username
        + "&password=" + password;

    console.log(loginUrl);

    //向服务器发送消息
    $.get(loginUrl, function (data, status) {
        //解析返回数据,
        //登录失败,服务器错误,提示用户原因
        if (status != "success") {
            promptUser("登录失败￣□￣｜｜\n请稍后再试");
        } else {
            //服务器没有错误,检查用户名和密码是否匹配
            switch (data) {
                case "1":
                    promptUser("没有此用户");
                    break;
                case "2":
                    promptUser("密码错误");
                    break;
                case "3":
                    promptUser("已经过期,请及时充值");
                    break;
                default:
                    //成功登陆,没有过期
                    //存储用户名密码
                    chrome.storage.sync.set({
                        username: username,
                        password: password
                    }, function (items) {
                        promptUser("已经成功登陆");
                    });
                    //告诉background
                    chrome.runtime.sendMessage({
                        type: "option_login_success",
                    }, function (response) {
                        console.log(response.farewell);
                    });
                    break;
            }
        }
    });
}

function promptUser(str) {
    console.log(str);
}
