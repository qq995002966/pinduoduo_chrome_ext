package com.xiangyouhui.pinduoduo_chrome_ext.persistence;

import java.util.Date;

public class UserInfo {
    String username;
    String password;

    public String getExpiryTimeStr() {
        return expiryTimeStr;
    }

    public void setExpiryTimeStr(String expiryTimeStr) {
        this.expiryTimeStr = expiryTimeStr;
    }

    String expiryTimeStr;

    public String getPassword() {
        return password;
    }

    @Override
    public String toString() {
        return username + ',' + password + ',' + expiryTimeStr+'\n';
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {

        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
