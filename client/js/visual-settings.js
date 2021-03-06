$(document).ready(function() {
    // helper function to get the username cookie from list of cookies
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    var clientServer = new ClientServer("localhost", 80);

    // visual settings object to send to server
    var object = {
        userName: "userName",
        visualSettings: {
            tokenColor: "Black and White",
            tokenShape: "Circle",
            boardColor: "Brown"
        }
    }

    object.userName = getCookie('Gousername');

    $('.token-color').click(function() {
        object.visualSettings.tokenColor = $(this).text().trim();
    });

    $('.token-shape').click(function() {
        object.visualSettings.tokenShape = $(this).text().trim();
    });

    $('.board-color').click(function() {
        object.visualSettings.boardColor = $(this).text().trim();

    });

    // defines an onclick that saves the settings
    $('.save-button').click(function() {
        console.log(document.cookie);
        clientServer.sendData(object, "setVisualSettings", function(status) { });
    });

});