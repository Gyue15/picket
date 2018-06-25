package edu.nju.gyue.picket.service;

import org.junit.runner.RunWith;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@SpringBootTest
@RunWith(SpringRunner.class)
public class MyTest {

    @Autowired
    SubscribeService subscribeService;

    @Test
    public void test1() {
        subscribeService.createSubscribe("test@test.com", 10);

        System.out.println(subscribeService.isSubscribe("test@test.com", 10));
        System.out.println(subscribeService.isSubscribe("test@tes2t.com", 10));
        System.out.println(subscribeService.isSubscribe("test@test.com", 12));
    }

}
