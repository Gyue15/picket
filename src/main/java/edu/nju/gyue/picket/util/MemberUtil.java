package edu.nju.gyue.picket.util;

public class MemberUtil {

    public static Double getMemberDiscount(Integer level) {
        return (100.0 - (double)level * 3.0) / 100.0;
    }

    public static Integer getMemberLevel(Integer point) {
        return point / 5000 > 10 ? 10 : point / 5000;
    }
}
