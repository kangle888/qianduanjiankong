let lastEvent;
['click', 'touchstart', 'mousedown', 'keydown', 'mouseover'].forEach((event) => {
  document.addEventListener(event, (e) => {
    // 获取标准的事件传播路径
    lastEvent = e;
    lastEvent.path = e.composedPath ? e.composedPath() : [];
  }, {
    capture: true,
    passive: true // 不阻止默认事件
  });
});

export default function getLastEvent() {
  return lastEvent;
}
