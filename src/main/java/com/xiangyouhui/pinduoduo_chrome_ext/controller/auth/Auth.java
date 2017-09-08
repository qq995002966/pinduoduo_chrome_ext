package com.xiangyouhui.pinduoduo_chrome_ext.controller.auth;

import com.xiangyouhui.pinduoduo_chrome_ext.Utils.TimeUtils;
import com.xiangyouhui.pinduoduo_chrome_ext.common.ReturnCode;
import com.xiangyouhui.pinduoduo_chrome_ext.persistence.UserInfo;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;

@RestController
public class Auth {

    @RequestMapping(value = "/login", method = {RequestMethod.GET})
    public String doLogin(@RequestParam(value = "username") String usernameParam,
                          @RequestParam(value = "password") String passwordParam) {
        UserInfo curUser = readUserInfo(usernameParam);
        if (curUser == null) {//没有这个用户
            return ReturnCode.NO_SUCH_USER;
        } else if (!curUser.getPassword().equals(passwordParam)) {
            //密码不正确
            return ReturnCode.WRONG_PASSWORD;
        } else if (TimeUtils.hasExpired(curUser.getExpiryTimeStr())) {
            //已经过期了 时间
            return ReturnCode.HAS_EXPIRED;
        } else {
            //一切正常
            return curUser.getExpiryTimeStr();
        }

    }

    @RequestMapping(value = "/register", method = {RequestMethod.GET})
    public String doRegister(@RequestParam(value = "username") String usernameParam,
                             @RequestParam(value = "password") String passwordParam) {
        UserInfo curUser = null;
        if ((curUser = readUserInfo(usernameParam)) != null) {
            //说明存在这个用户了
            return ReturnCode.HAS_USER;
        } else {
            //没有这个用户
            curUser = new UserInfo();
            curUser.setUsername(usernameParam);
            curUser.setPassword(passwordParam);
            curUser.setExpiryTimeStr(TimeUtils.getRegisterExp());

            storeUserInfo(curUser);
            return curUser.getExpiryTimeStr();
        }
    }

    private void storeUserInfo(UserInfo curUser) {
        try {
            BufferedWriter userInfoBW = new BufferedWriter(new FileWriter("user_info.txt", true));
            userInfoBW.write(curUser.toString());
            userInfoBW.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private UserInfo readUserInfo(String usernameParam) {
        //读取到我们所需的用户信息
        UserInfo currentUser = null;
        try {
            BufferedReader userInfoBR = new BufferedReader(new FileReader("user_info.txt"));
            String currentLine = null;
            while ((currentLine = userInfoBR.readLine()) != null) {
                String[] userInfos = currentLine.split(",");
                if (userInfos.length == 3) {
                    if (userInfos[0].equals(usernameParam)) {
                        //说明找到了一个用户
                        currentUser = new UserInfo();
                        currentUser.setUsername(userInfos[0]);
                        currentUser.setPassword(userInfos[1]);
                        currentUser.setExpiryTimeStr(userInfos[2]);
                        break;
                    }
                }
            }
            userInfoBR.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return currentUser;
    }
}
