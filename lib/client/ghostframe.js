
const supported = 'postMessage' in window;

let port = null;

if (supported) {
  window.onmessage = (evt) => {
    if (evt.data === 'ghostframe') {
      port = evt.ports[0];
      updateLocation();
    }
  };
}

export function updateLocation() {
  if (!supported) {
    // if browser doesn't support postMessage we silently fail
    return;
  }
  if (!port) {
    console.warn('location update failed, ghostframe is not connected');
    return;
  }
  const message = {
    location: String(document.location),
    title: document.title
  };
  port.postMessage(JSON.stringify(message));
}
