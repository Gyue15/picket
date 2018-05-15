package edu.nju.gyue.picket.configuration.resource;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class FilePathConfig extends WebMvcConfigurerAdapter {
    public static final String PHOTO_PATH = "/Users/gyue/Pictures/MyPicture/photo/";

    public static final String AREA_GRAPH_PATH = "/Users/gyue/graph/area";

    public static final String SEAT_GRAPH_PATH = "/Users/gyue/graph/seat";

    //供客户端使用的url前缀
    public static final String PHOTO_URL = "http://localhost:8080/photo/";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/photo/**").addResourceLocations("file:" + PHOTO_PATH);
        registry.addResourceHandler("/**").addResourceLocations("classpath:/static/").addResourceLocations
                ("classpath:/templates/");
        super.addResourceHandlers(registry);

    }
}
