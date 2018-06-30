package edu.nju.gyue.picket.configuration.param;

public class Param {
    public static final Double MONEY_PERCENT = 0.7;

    public static final Integer MONEY_PER_POINT = 10;

    public static final String SPLIT_RE = "\\u007C";

    public static final String SPLIT = "|";

    public static final String JSON_SUFFIX = ".json";

    public static final String PHOTO_SUFFIX = ".jpg";

    public static final Integer UNSELECT_MAX_NUM = 20000000;

    public static final Integer SELECT_MAX_NUM = 6;

    public static final String MANAGER_ACCOUNT = "admin";

    public static final Integer DAY_MILLIS = 24 * 60 * 60 * 1000;

    public static final Integer[] DAY_LEVEL = {3, 7, 30};

    public static final Double[] RETURN_LEVEL = {0.0, 0.5, 0.7, 1.0};

    public static final Long FIVE_MINS = 5 * 60 * 1000L;

    public static final Long TWO_WEEK = 14 * 24 * 60 * 60 * 1000L;

    private static final String[] NATURE_WORD = {"a", "n", "v", "vn"};

    public static boolean isKey(String natureString) {
        for (String str: NATURE_WORD) {
            if (str.equals(natureString)) {
                return true;
            }
        }
        return false;
    }

}
