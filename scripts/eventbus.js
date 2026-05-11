const listeners = {};

function on(event, callback) {
    if (!listeners[event]) {
        listeners[event] = [];
    }
    listeners[event].push(callback);
}

function post(event, data) {
    const eventListeners = listeners[event];
    if (!eventListeners) { return; }
    for (const callback of eventListeners) {
        callback(data)
    }
}