package com.xiangyouhui.pinduoduo_chrome_ext.Utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

@Component
public class TimeUtils {
    @Value("${pinduoduo.add-day}")
    int addDay;

    final String defaultDateFormat = "yyyy-MM-dd-hh:mm";

    public String getRegisterExp() {
        Calendar now = Calendar.getInstance();
        System.out.println(addDay);
        now.add(Calendar.DAY_OF_YEAR, addDay);

        SimpleDateFormat sdf = new SimpleDateFormat(defaultDateFormat);
        return sdf.format(now.getTime());
    }

    public boolean hasExpired(String expiryDateStr) {
        SimpleDateFormat sdf = new SimpleDateFormat(defaultDateFormat);
        try {
            Calendar expiryTime = Calendar.getInstance();
            expiryTime.setTime(sdf.parse(expiryDateStr));

            Calendar curTime = Calendar.getInstance();
            if (curTime.after(expiryTime)) {
                return true;
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return false;
    }
}
