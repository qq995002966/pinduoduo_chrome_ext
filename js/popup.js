/**
 * popup.js的生命周期就是 弹出页面出现的时间,如果弹出页面消失,popup.js的生命结束
 * 所以需要background.js作为数据的中枢,这都是chrome 插件的框架的限制.
 */
document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.getElementsByTagName("button");
    for (var i = 0; i < buttons.length; i++) {
        var temp = buttons[i];
        if (temp.innerText == "复制拼多多信息") {//为 复制拼多多信息按钮添加响应事件
            temp.addEventListener("click", getUserInfo);
        }
        else if (temp.innerText == "粘贴到淘宝") {
            temp.addEventListener("click", setUserInfoTaoBao);
        }

    }
});

/**
 * 复制拼多多信息 按钮响应事件,逻辑为 向get_pin_info.js发送一个消息
 */
function getUserInfo() {
    console.log("getUserInfo");
    //这里需要注意的是,两个context js之间(popup.js也算是content js)发送消息,要用如下的方式
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "popup_getUserInfo"}, function (response) {
            console.log(response.farewell);
        });
    });
}

function setUserInfoTaoBao() {
    console.log("getUserInfo");

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "popup_setUserInfoTaoBao"}, function (response) {
            console.log(response.farewell);
        });
    });
}