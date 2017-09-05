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


