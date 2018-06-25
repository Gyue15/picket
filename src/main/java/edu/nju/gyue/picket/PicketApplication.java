package edu.nju.gyue.picket;

import edu.nju.gyue.picket.socket.WebSocket;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PicketApplication {

    public static void main(String[] args) {
        SpringApplication springApplication = new SpringApplication(PicketApplication.class);
        ConfigurableApplicationContext configurableApplicationContext = springApplication.run(args);
        WebSocket.setApplicationContext(configurableApplicationContext);
    }
}
