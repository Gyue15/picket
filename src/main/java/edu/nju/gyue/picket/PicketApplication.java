package edu.nju.gyue.picket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PicketApplication {

    public static void main(String[] args) {
        SpringApplication.run(PicketApplication.class, args);
    }
}
