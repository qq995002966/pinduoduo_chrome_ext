console.log("我是get_pin_info");


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request.type == "popup_getUserInfo") {//用户点击获取拼多多信息按钮
            //1.读取出来需要的信息,用户名,手机号,地址
            //2.然后把相关的信息发送给 backgroud.js

            //1.读取相关信息
            var userInfo = document.getElementsByClassName("o-d-b-i-c-people")[0];
            var name = userInfo.getElementsByTagName("span")[1].innerText;
            var phone = userInfo.getElementsByTagName("span")[2].innerText;

            var address = document.getElementsByClassName("o-d-b-i-c-address")[0].getElementsByTagName("span")[1].innerText;
            //2.把相关的信息发送给background.js
            chrome.runtime.sendMessage({
                type: "pinduoduo_setUserInfo",
                name: name,
                phone: phone,
                address: address
            }, function (response) {
                console.log(response.farewell);
            });
            sendResponse({farewell: "successful"});
        }else if(request.type=="background_getUserInfo"){
            //这里是使用快捷键的时候,直接收到的background.js的请求时的操作
            //1.读取相关信息
            var userInfo = document.getElementsByClassName("o-d-b-i-c-people")[0];
            var name = userInfo.getElementsByTagName("span")[1].innerText;
            var phone = userInfo.getElementsByTagName("span")[2].innerText;

            var address = document.getElementsByClassName("o-d-b-i-c-address")[0].getElementsByTagName("span")[1].innerText;
            //2.把相关的信息返回给background.js
            sendResponse({
                name: name,
                phone: phone,
                address: address
            });
        }
    });


