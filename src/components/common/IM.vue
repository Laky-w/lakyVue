<template>
  <div>
    <!-- <el-button size="mini" icon="el-icon-search" @click="sendMessage('ee')">发送信息</el-button> -->
    <div>在线人员</div>
    <div>
      <ul>
        <li v-for="(item,index) in onlineUsers">
          {{item.name}}
          <el-button size="mini" icon="el-icon-search" @click="sendMessage(item)">发送信息</el-button>
        </li>
      </ul>
    </div>
    <h3>接收的信息</h3>
    <div>{{messsage}}</div>
    <textarea placeholder="输入你要发送的信息">
      {{messsage}}
    </textarea>

  </div>

</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      onlineUsers: [],
      webSocket: null,
      messsage: ""
    }
  },
  created() {
    this.loadWebSock();
  },
  destroyed() {
    this.websocket.close();
  },
  methods: {
    loadWebSock() {
      //判断当前浏览器是否支持WebSocket
      let self = this;
      if ('WebSocket' in window) {
        self.websocket = new WebSocket(axios.defaults.webSocketBaseURL + "lakyIm/" + sessionStorage.getItem("token"));
        //连接发生错误的回调方法
        self.websocket.onerror = function () {
          // self.setMessageInnerHTML("error");
        };

        //连接成功建立的回调方法
        self.websocket.onopen = function (event) {
          // self.setMessageInnerHTML("open");
        }

        //接收到消息的回调方法
        self.websocket.onmessage = function (event) {
          self.setMessageInnerHTML(event.data);
        }

        //连接关闭的回调方法
        self.websocket.onclose = function () {
          // self.setMessageInnerHTML("close");
        }
      } else {
        alert("Dont support websocket");
      }
    },
    setMessageInnerHTML(messsage) {
      let messageObj = JSON.parse(messsage);
      //在线列表
      if (messageObj.messageType == "100") {
        this.onlineUsers = JSON.parse(messageObj.messageContent);
      } else if (messageObj.messageType == "101") {
        this.messsage = messageObj.messageContent;
      }
    },
    sendMessage(user) {
      let messageDto = {};
      messageDto.userId = user.id;
      messageDto.messageType = "101";
      messageDto.messageContent = "您好," + user.name + "————————时间：" + new Date()
      this.websocket.send(JSON.stringify(messageDto));
      // alert(userId);
    }
  }
}
</script>