import log from './log';
const HEART_BEAT = 'ping';
export default class Ws {
  constructor(options, protocols) {
    const prefix = window.location.protocol.includes('https') ? 'wss' : 'ws';
    this.url = process.env.NODE_ENV === 'development' ? options.url : `${prefix}://${window.location.host}${options.url}`;
    this.protocols = protocols;
    this.webSocketState = false;
    this.isCustomClose = true;
    this.reconnectTime = options.reconnectTime; //断线重连时间间隔
    this.heartBeatTime = options.heartBeatTime; //心跳间隔时间
    this.waitBeatTime = options.waitBeatTime; //心跳等待时间
    this.socketData = '';
    this.callback = options.callback;
    this.onmessage = this.onmessage;

    this.HEART_KEY = options.HEART_KEY; //心跳响应key
    this.HEART_VALUE = options.HEART_VALUE; //心跳响应value
    this.createWs();
  }

  createWs() {
    if ('WebSocket' in window) {
      // 实例化
      this.ws = null;
      this.ws = new WebSocket(this.url, this.protocols);
      // 监听事件
      this.onopen();
      this.onerror();
      this.onclose();
      this.onmessage();
    } else {
      console.log('你的浏览器不支持 WebSocket');
    }
  }

  // 监听成功
  onopen() {
    this.ws.onopen = () => {
      // console.log('socket已连接成功');
      log('success', 'socket已连接成功');
      this.webSocketState = true;
      this.startHeartBeat(this.heartBeatTime);
    };
  }
  startHeartBeat(time) {
    setTimeout(() => {
      this.send(this.HEART_KEY);
      this.waitingServer();
    }, time);
  }
  //延时等待服务端响应，通过webSocketState判断是否连线成功
  waitingServer() {
    this.webSocketState = false;
    setTimeout(() => {
      if (this.webSocketState) {
        this.startHeartBeat(this.heartBeatTime);
        return;
      }
      log('warning', '心跳无响应，已断线');
      try {
        this.close();
        if (this.ws) {
          this.start();
        }
      } catch (e) {
        console.log('连接已关闭，无需关闭');
      }
    }, this.waitBeatTime);
  }
  // 监听错误
  onerror() {
    this.ws.onerror = (err) => {
      console.log('onerror', err);
      this.isCustomClose = false;
      this.isReconnectionLoading = false;
    };
  }

  // 监听关闭
  onclose() {
    this.ws.onclose = () => {
      log('success', 'socket关闭成功');
      // 用户手动关闭的不重连
      if (this.isCustomClose) return;
      if (this.ws) {
        this.reconnection();
        this.isReconnectionLoading = false;
      }
    };
  }

  // 接收 WebSocket 消息
  async onmessage() {
    this.ws.onmessage = (event) => {
      // console.log(event.data);
      try {
        if (event.data == this.HEART_VALUE) {
          this.webSocketState = true;
          return;
        }
        const data = JSON.parse(event.data);
        this.callback(data);
      } catch (error) {
        console.log(error, 'error');
      }
    };
  }

  // 重连
  reconnection() {
    // 防止重复
    if (this.isReconnectionLoading) return;
    this.isReconnectionLoading = true;
    clearTimeout(this.timeId);
    this.timeId = null;
    this.timeId = setTimeout(() => {
      this.createWs();
    }, this.reconnectTime);
  }

  // 发送消息
  send(message) {
    if (this.webSocketState) {
      this.ws.send(message);
    }
  }

  // 手动关闭
  close() {
    this.isCustomClose = true;
    this.isReconnectionLoading = false;
    this.ws.close();
  }

  // 手动开启
  start() {
    this.isCustomClose = false;
    this.reconnection();
  }

  // 订阅
  subscribe(eventName, cb) {
    this.eventCenter.on(eventName, cb);
  }

  // 取消订阅
  unsubscribe(eventName, cb) {
    this.eventCenter.off(eventName, cb);
  }

  // 销毁
  destroy() {
    this.close();
    this.ws = null;
    this.isCustomClose = true;
    this.errorStack = null;
    this.eventCenter = null;
    this.isCustomClose = true;
    clearTimeout(this.timeId);
    this.webSocketState = false;
  }
}
