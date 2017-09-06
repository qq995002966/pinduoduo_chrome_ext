console.log("我是eventPage(#^.^#)");

var name = "";
var phone = "";
var address = "";

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        //拼多多js接收到popupjs的指令之后会向background js发送这样一个请求,存储用户信息
        if (request.type == "pinduoduo_setUserInfo") {
            name = request.name;
            phone = request.phone;
            address = request.address;

            sendResponse({farewell: "successful"});
        } else if (request.type == "taobao_getUserInfo") {
            //淘宝js接收到popup.js的指令之后会想background js发送这样一个请求,获取用户信息
            sendResponse({farewell: "successful", name: name, phone: phone, address: address});
        }

    });

chrome.commands.onCommand.addListener(function (command) {
    console.log(command);
    if (command.valueOf() == "getUserInfo") {
        //这个和用户点击 复制商品信息的效果是一样的
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
    } else if (command.valueOf() == "setUserInfo") {
        //这个和点击 粘贴到淘宝是一样的
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
});

