/* global config, getRoomName, getConfigParamsFromUrl */
/* global createConnectionExternally */
/**
 * Implements extrnal connect using createConnectionExtenally function defined
 * in external_connect.js for Jitsi Meet. Parses the room name and token from
 * the url and executes createConnectionExtenally.
 *
 * NOTE: If you are using lib-jitsi-meet without Jitsi Meet you should use this
 * file as reference only because the implementation is Jitsi Meet specific.
 *
 * NOTE: For optimal results this file should be included right after
 * exrnal_connect.js.
 */



 /**
  * Gets the token from the URL.
  */
function buildToken(){
    var params = getConfigParamsFromUrl();
    return params["config.token"] || config.token;
}

/**
 * Executes createConnectionExternally function.
 */
(function () {
    // FIXME: Add implementation for changing that config from the url for
    // consistency
    var url = config.externalConnectUrl;

    /**
     * Check if connect from connection.js was executed and executes the handler
     * that is going to finish the connect work.
     */
    function checkForConnectHandlerAndConnect() {

        if(window.APP && window.APP.connect.status === "ready") {
            window.APP.connect.handler();
        }
    }

    function error_callback(error){
        if(error) //error=undefined if external connect is disabled.
            console.warn(error);
        // Sets that global variable to be used later by connect method in
        // connection.js
        window.XMPPAttachInfo = {
            status: "error"
        };
        checkForConnectHandlerAndConnect();
    }

    if(!url || !window.createConnectionExternally) {
        error_callback();
        return;
    }
    var room_name = getRoomName();
    if(!room_name) {
        error_callback();
        return;
    }

    url += "?room=" + room_name;

    var token = buildToken();
    if(token)
        url += "&token=" + token;

    createConnectionExternally(url, function(connectionInfo) {
        // Sets that global variable to be used later by connect method in
        // connection.js
        window.XMPPAttachInfo = {
            status: "success",
            data: connectionInfo
        };
        checkForConnectHandlerAndConnect();
    }, error_callback);
})();
