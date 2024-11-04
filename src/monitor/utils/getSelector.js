export const getSelector = (path) => {
  return path.reverse().filter(element => {
    return element !== document && element !== window;
  }).map(element => {
    let selector = element.localName;
    if (element.id) {
      selector += '#' + element.id;
    }
    if (element.className) {
      selector += '.' + element.className.split(' ').filter(className => className);
    }
    return selector;
  }).join(' ');
};