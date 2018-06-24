package edu.nju.gyue.picket.socket;

import com.alibaba.fastjson.JSON;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint(value = "/notification")
@Component
public class WebSocket {

    class Notification {
        int id;
        String name;
        Notification() {
            this.id = 20;
            this.name = "陈慧娴［Priscilla－ism］巡回演唱会";
        }

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
    private static int onlineCount = 0;

    private static Map<String, Session> webSocketMap = new ConcurrentHashMap<>();

    private static CopyOnWriteArraySet<WebSocket> webSocketSet = new CopyOnWriteArraySet<>();

    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;

    @OnOpen
    public void onOpen(Session session) {
        this.session = session;
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
        webSocketSet.remove(this);  //从set中删除
        subOnlineCount();           //在线数减1
        System.out.println("A Socket closed, now:" + getOnlineCount());
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        System.out.println("Message from client:" + message);
        webSocketMap.put(message, session);
        try {
            String json = JSON.toJSONString(new Notification());
            sendMessage(session, json);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

     @OnError
     public void onError(Session session, Throwable error) {
         System.out.println("发生错误");
         error.printStackTrace();
     }


     public void sendMessage(String message) throws IOException {
         this.session.getBasicRemote().sendText(message);
     }

    public void sendMessage(Session session, String message) throws IOException {
        session.getBasicRemote().sendText(message);
    }

    public static synchronized int getOnlineCount() {
        return onlineCount;
    }

    public static synchronized void addOnlineCount() {
        WebSocket.onlineCount++;
    }

    public static synchronized void subOnlineCount() {
        WebSocket.onlineCount--;
    }
}
