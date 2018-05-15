package edu.nju.gyue.picket.util;

import edu.nju.gyue.picket.configuration.param.Param;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtil {

    private static DateFormat dateFormat;

    /**
     * 获得指定date对象前n天的date对象
     *
     * @param specifiedDay 给定的date对象
     * @param n            往前的天数
     * @return 前n天的date对象(n = 0时返回自身)
     */
    public static Date getSpecifiedDayBefore(Date specifiedDay, int n) {
        Calendar c = Calendar.getInstance();
        c.setTime(specifiedDay);
        int day = c.get(Calendar.DATE);
        c.set(Calendar.DATE, day - n);
        return c.getTime();
    }

    /**
     * 获得指定date对象后n天的date对象
     *
     * @param specifiedDay 给定的date对象
     * @param n            往后的天数
     * @return 前一天的date对象(n = 0时返回自身)
     */
    public static Date getSpecifiedDayAfter(Date specifiedDay, int n) {
        Calendar c = Calendar.getInstance();
        c.setTime(specifiedDay);
        int day = c.get(Calendar.DATE);
        c.set(Calendar.DATE, day + n);
        return c.getTime();
    }

    public static Integer getPeriodDate(Date fromDate, Date toDate) {
        long fromTime = Math.min(fromDate.getTime(), toDate.getTime());
        long toTime = Math.max(fromDate.getTime(), toDate.getTime());
        return (int) ((toTime - fromTime) / Param.DAY_MILLIS);
    }

    public static String formatDate(Date date) {
        if (dateFormat == null) {
            dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        }
        return dateFormat.format(date);
    }

    public static String formatDate(Date fromDate, Date toDate) {
        if (dateFormat == null) {
            dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        }
        return dateFormat.format(fromDate) + " ～ " + dateFormat.format(toDate);
    }


}
