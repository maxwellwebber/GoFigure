"use strict";

/**
 * Class used to send data from client to server
 */

class ClientServer {

    constructor(url, port) {
        this._url = url || "localhost";
        this._port = port || 3000;
    }

    /**
     * @param obj {object} the data to send.
     * @param path {string} the server path to make the request to.
     * @param callback {function} called when the server responds.
     *      Takes 1 parameter, an error parameter which is null if everything is OK. an object containing an error
     *          message otherwise
     */
    sendAndRecieveData(obj, path, callback) {

        console.log("sending POST to " + path + " payload: " + JSON.stringify(obj));

        var postXhr = new XMLHttpRequest();
        postXhr.open("POST", path, true);
        postXhr.setRequestHeader("Content-type", "application/json");
        postXhr.send(JSON.stringify(obj));

        postXhr.onreadystatechange = function() {

            // this function is executed when the request comes 
            // back from the server. 

            if (postXhr.readyState == 4 && postXhr.status == 200) {       
                // sends data to client    
                callback(JSON.parse(postXhr.responseText));
            } else if (postXhr.readyState == 4 && postXhr.status !== 200) {
                // error message from server occured
                callback(postXhr.status);
            }
        }
    }

    /**
     * @param obj {object} the data to send.
     * @param path {string} the server path to make the request to.
     * @param callback {function} called when the server responds.
     *      Takes 1 parameter, an error parameter which is null if everything is OK.
     */

    sendData(obj, path, callback) {

        console.log("sending POST to " + path + " payload: " + JSON.stringify(obj));

        var postXhr = new XMLHttpRequest();
        postXhr.open("POST", path, true);
        postXhr.setRequestHeader("Content-type", "application/json");
        postXhr.send(JSON.stringify(obj));

        postXhr.onreadystatechange = function() {

            // this function is executed when the request comes 
            // back from the server. 

            if (postXhr.readyState == 4 && postXhr.status == 200) {
                callback(null);
            } else if (postXhr.readyState == 4 && postXhr.status !== 200) {
                callback(postXhr.status);
            }
        }
    }
}