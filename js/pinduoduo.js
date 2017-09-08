console.log("我是get_pin_info");


//接受消息
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request.type == "background_getUserInfo") {
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
            console.log(name);
            console.log(phone);
            console.log(address);
        }
    });


