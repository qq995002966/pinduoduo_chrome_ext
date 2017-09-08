var baseUrl = "http://localhost:8989"

document.addEventListener('DOMContentLoaded', function () {
    //首先为两个按钮注册响应事件
    document.getElementById("bs_login_btn").addEventListener('click', login);
    document.getElementById("bs_register_btn").addEventListener('click', register);
    //检查是否已经登陆过了
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
});


function login() {
    //从网页中读取用户名,密码
    var username = document.getElementsByName("username")[0].value;
    var password = document.getElementsByName("userpass")[0].value;

    if ((username == null) || (username == "")) {
        promptUser("请填写用户名");
        return;
    }
    if ((password == null) || (password == "")) {
        promptUser("请填写密码");
        return;
    }

    doLogin(username, password);
}

function promptUser(str) {
    document.getElementById("div_has_login").innerText = str;
}

function register() {
    //从网页中读取用户名,密码
    var username = document.getElementsByName("username")[0].value;
    var password = document.getElementsByName("userpass")[0].value;

    if ((username == null) || (username == "")) {
        promptUser("请填写用户名");
        return;
    }
    if ((password == null) || (password == "")) {
        promptUser("请填写密码");
        return;
    }
    doRegister(username, password);
}

function doRegister(username, password) {
    //构建get url
    var registerUrl = baseUrl
        + "/register"
        + "?username=" + username
        + "&password=" + password;

    console.log(registerUrl);
    //向服务器发送消息
    $.get(registerUrl, function (data, status) {
        //解析返回数据,
        //登录失败,服务器错误,提示用户原因
        if (status != "success") {
            promptUser("登录失败￣□￣｜｜\n请稍后再试");
        } else {
            //服务器没有错误,解析服务器返回值
            switch (data) {
                case "1000":
                    promptUser("此用户名已经被注册,请更换用户名");
                    break;
                default:
                    //注册成功
                    //存储用户名密码
                    chrome.storage.sync.set({
                        username: username,
                        password: password
                    }, function (items) {
                        promptUser("已经成功注册,无需再次登录\n关闭此页面,直接使用即可");
                    });
                    //告诉background
                    chrome.runtime.sendMessage({
                        type: "option_login_success"
                    }, function (response) {
                        console.log(response.farewell);
                    });
                    break;
            }
        }
    });
}


function doLogin(username, password) {
    //构建get url
    var loginUrl = baseUrl
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
                    promptUser("没有用户  " + username + "\n请重新登陆 或 注册");
                    break;
                case "2":
                    promptUser("密码错误");
                    break;
                case "3":
                    promptUser("账户 " + username + "   已经过期\n请及时充值 或 者更换账户登录");
                    break;
                default:
                    //成功登陆,没有过期
                    //存储用户名密码
                    chrome.storage.sync.set({
                        username: username,
                        password: password
                    }, function (items) {
                        promptUser("已经成功登陆\n用户名 : " + username + "\t");
                    });
                    //告诉background
                    chrome.runtime.sendMessage({
                        type: "option_login_success"
                    }, function (response) {
                        console.log(response.farewell);
                    });
                    break;
            }
        }
    });
}
