import getLastEvent from '../utils/getLastEvent'
import { getSelector } from '../utils/getSelector'
import tracker from '../utils/tracker'

export const injectJsError = () => {

  console.log('injectJsError')
  // 监听全局未捕获的错误
  window.addEventListener('error', (event) => {
    console.log('error', event)
    let lastEvent = getLastEvent()
    let log = {
      kind: 'stability',      // 监控指标大类
      type: 'error',           // 小类型
      errorType: 'jsError',   // JS执行错误
      url: location.href,     // 当前页面URL
      message: event.message, // 错误信息
      filename: event.filename, // 错误文件
      position: `${event.lineno}:${event.colno}`, // 错误位置
      stack: getLines(event.error.stack), // 错误堆栈
      selector: lastEvent ? getSelector(lastEvent.path) : '',           // 选择器
    }
    tracker.send(log)
    console.log('error', log)
  }, true)

  // 监听全局未捕获的 Promise 错误
  window.addEventListener('unhandledrejection', (event) => {
    console.log('unhandledrejection', event)
    let lastEvent = getLastEvent()
    let message;
    let filename;
    let lineno;
    let column;
    let stack = '';
    let reason = event.reason
    if (typeof reason === 'string') {
      message = reason;
    } else if (typeof reason === 'object') { // Promise 错误一般是一个对象
      if (reason.stack) {
        let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
        filename = matchResult[1];
        lineno = matchResult[2];
        column = matchResult[3];
      }
      message = reason.message;
      stack = getLines(reason.stack);
    }
    tracker.send({
      kind: 'stability',      // 监控指标大类
      type: 'error',           // 小类型
      errorType: 'promiseError',   // JS执行错误
      url: location.href,     // 当前页面URL
      message, // 错误信息
      filename, // 错误文件
      position: `${lineno}:${column}`, // 错误位置
      stack, // 错误堆栈
      selector: lastEvent ? getSelector(lastEvent.path) : '',           // 选择器
    })
  }, true)
}
function getLines(stack) {
  return stack.split('\n').slice(1).map(item => item.replace(/^\s+|\s+$/g, '')).join('')
}