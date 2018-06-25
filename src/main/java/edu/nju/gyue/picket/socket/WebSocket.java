package edu.nju.gyue.picket.socket;

import com.alibaba.fastjson.JSON;
import edu.nju.gyue.picket.entity.Notification;
import edu.nju.gyue.picket.service.SubscribeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.server.standard.SpringConfigurator;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint(value = "/notification")
@Component
public class WebSocket{

    private String userEmail;

    private SubscribeService subscribeService;

    private static ApplicationContext applicationContext;

    public static void setApplicationContext(ApplicationContext applicationContext) {
        WebSocket.applicationContext = applicationContext;
    }

    private static int onlineCount = 0;

    private static Map<String, Set<Session>> webSocketMap = new ConcurrentHashMap<>();

    private static CopyOnWriteArraySet<WebSocket> webSocketSet = new CopyOnWriteArraySet<>();


    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;

    @OnOpen
    public void onOpen(Session session) {
        this.session = session;
        this.subscribeService = applicationContext.getBean(SubscribeService.class);
        webSocketSet.add(this);
        addOnlineCount();
        System.out.println("New Socket has been add, now:" + getOnlineCount());
        try {
            sendMessage("welcome");
        } catch (IOException e) {
            System.out.println("IO异常");
        }
    }

    @OnClose
    public void onClose() {
        webSocketSet.remove(this);
        webSocketMap.get(userEmail).remove(this.session);
        subOnlineCount();
        System.out.println("A Socket closed, now:" + getOnlineCount());
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        System.out.println("Message from client:" + message);
        this.userEmail = message;
        if (!webSocketMap.containsKey(userEmail)) {
            webSocketMap.put(userEmail, new CopyOnWriteArraySet<>());
        }
        webSocketMap.get(userEmail).add(session);

        notifySession(session, subscribeService.getUserNotificationList(message));
    }

    @OnError
    public void onError(Session session, Throwable error) {
        System.out.println("发生错误");
        error.printStackTrace();
    }

    public static void notifyUsers(Map<String, List<Notification>> userNotificationMap) {
        for (String userEmail: userNotificationMap.keySet()) {
            notifyUser(userEmail, userNotificationMap.get(userEmail));
        }
    }

    private static void notifyUser(String userEmail, List<Notification> notificationList) {
        if (webSocketMap.containsKey(userEmail)) {
            try {
                for (Session session: webSocketMap.get(userEmail)) {
                    sendMessage(session, JSON.toJSONString(notificationList));
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private static void notifySession(Session session, List<Notification> notificationList) {
        try {
            sendMessage(session, JSON.toJSONString(notificationList));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void sendMessage(String message) throws IOException {
        this.session.getBasicRemote().sendText(message);
    }

    private static void sendMessage(Session session, String message) throws IOException {
        session.getBasicRemote().sendText(message);
    }

    private static synchronized int getOnlineCount() {
        return onlineCount;
    }

    private static synchronized void addOnlineCount() {
        WebSocket.onlineCount++;
    }

    private static synchronized void subOnlineCount() {
        WebSocket.onlineCount--;
    }
}
