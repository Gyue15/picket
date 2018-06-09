package edu.nju.gyue.picket.util;

import edu.nju.gyue.picket.configuration.param.Param;
import edu.nju.gyue.picket.configuration.resource.FilePathConfig;
import edu.nju.gyue.picket.exception.BadRequestException;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

public class FileUtil {

    public static String upLoad(MultipartFile file) {
        String fileUrl = "";
        if (!file.isEmpty()) {
            try {
                String fileName = System.currentTimeMillis() + Param.PHOTO_SUFFIX;
                // 文件保存路径
                String filePath = FilePathConfig.PHOTO_PATH + fileName;
                // 文件url
                fileUrl = FilePathConfig.PHOTO_URL + fileName;
                File dest = new File(filePath);

                // 检测是否存在目录
                if (!dest.getParentFile().exists()) {
                    boolean success = dest.getParentFile().mkdirs();
                    if (!success) {
                        throw new BadRequestException("文件上传失败");
                    }
                }

                file.transferTo(dest);
            } catch (Exception e) {
                e.printStackTrace();
                throw new BadRequestException("文件上传失败");
            }
        }
        System.out.println("upload success");
        return fileUrl;
    }

/*
    public static String saveFile(String content, String path) {
        String filePath = path + "/" + System.currentTimeMillis() + Param.JSON_SUFFIX;
        File file = new File(filePath);
        try {
            if (!file.getParentFile().exists()) {
                //如果目标文件所在的目录不存在，则创建父目录
                if (!file.getParentFile().mkdirs()) {
                    throw new BadRequestException("文件创建失败");
                }
            }
            if (!file.createNewFile()) {
                throw new BadRequestException("文件创建失败");
            }
            BufferedWriter bw = new BufferedWriter(new FileWriter(file));
            bw.write(content);
            bw.flush();
            bw.close();
        } catch (IOException e) {
            e.printStackTrace();
            throw new BadRequestException("文件保存失败");
        }
        return filePath;
    }

    public static String readFile(String filePath) {
        File file = new File(filePath);
        StringBuilder sb = new StringBuilder("");
        try {
            BufferedReader br = new BufferedReader(new FileReader(file));
            String str;
            while ((str = br.readLine()) != null) {
                sb.append(str);
            }
        } catch (IOException e) {
            e.printStackTrace();
            throw new BadRequestException("文件读取失败");
        }
        return sb.toString();
    }
*/
//    public static String testSeatList() throws IOException {
//        File file = new File("/Users/gyue/Pictures/MyPicture/graph/test");
//        BufferedReader bufferedReader = new BufferedReader(new FileReader(file));
//        StringBuffer stringBuffer = new StringBuffer("");
//        stringBuffer.append(bufferedReader.readLine());
//        return stringBuffer.toString();
//    }
}
