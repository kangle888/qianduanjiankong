let host = "cn-shanghai.log.aliyuncs.com";
let project = "xukanglemonior";
let logstore = "webmonitor";
let userAgent = require("user-agent");
function formatTimestamp(timestamp) {
  const date = new Date(Number(timestamp));
  return date.toLocaleString(); // 输出本地化的日期和时间
}

function getExtraData() {
  return {
    title: document.title,
    url: location.href,
    timestamp: formatTimestamp(Date.now()),
    userAgent: userAgent.parse(navigator.userAgent)
  };
}

class SendTracker {
  constructor() {
    this.url = `http://${project}.${host}/logstores/${logstore}/track?APIVersion=0.6.0`; // 完整的上报路径
    this.xhr = new XMLHttpRequest();
  }

  // 发送日志数据的方法
  send(data = {}) {
    let extraData = getExtraData();
    let log = { ...extraData, ...data };
    // 对象的值不能是数紫，需要转成字符串
    // 将嵌套对象转换为 JSON 字符串
    for (let key in log) {
      if (typeof log[key] === "object") {
        log[key] = JSON.stringify(log[key]);
      }
    }

    // 使用 URLSearchParams 将 log 对象转换为 key=value 的查询参数字符串
    const params = new URLSearchParams(log).toString();
    const fullUrl = `${this.url}&${params}`; // 将参数拼接到 URL 后面

    // 配置 XMLHttpRequest
    this.xhr.open("GET", fullUrl, true);

    // 设置请求头，确保请求能够被阿里云日志服务接受
    this.xhr.setRequestHeader("Content-Type", "application/json");

    // 发送请求
    this.xhr.send();

    // 监听请求完成的回调（可选）
    this.xhr.onload = () => {
      if (this.xhr.status === 200) {
        console.log("日志发送成功");
      } else {
        console.error("日志发送失败", this.xhr.statusText);
      }
    };

    // 错误处理
    this.xhr.onerror = () => {
      console.error("请求出错，请检查网络或URL配置");
    };
  }
}

export default new SendTracker();
