window.onload = () => {
  'use strict';

  if (!('MessageChannel' in window && 'postMessage' in window && 'history' in window)) {
    // silent fail if browser doesn't support required features
    return;
  }

  // DOM references
  var ghostEl = document.getElementById('ghost'); // bug in Babili requires these to be vars
  var ghostWindow = ghostEl.contentWindow;
  var baseURL = ghostEl.getAttribute('src');

  // construct channel between host and iframe
  function bootstrap() {
    const channel = new MessageChannel();
    ghostWindow.postMessage('ghostframe', '*', [channel.port2]);

    // listen to URL changes
    channel.port1.onmessage = (evt) => {

      let data;
      try {
        data = JSON.parse(evt.data);
      } catch (err) {
        console.warn(`ghostframe received data that is not JSON: ${evt.data}`);
        return;
      }
      const { location, title } = data;

      const match = location.match(/\w+:\/\/[^/]+\/([^?#]*)(.*)/);
      if (!match) {
        console.warn(`ghostframe received data that is not a URL: "${evt.data}"`);
        return;
      }
      const path = match[1];
      const queryAndHash = match[2];

      document.title = title;
      window.history.pushState(path, title, `/${path}${queryAndHash}`);

    }; // channel.port1.onmessage
  } // bootstrap

  // update iframe onload
  const localPath = String(window.location).match(/\w+:\/\/[^/]+\/(.*)/)[1];
  if (localPath.length) {
    ghostEl.setAttribute('src', `${baseURL}/${localPath}`);
    ghostEl.onload = bootstrap;
  } else {
    bootstrap();
  }
};
