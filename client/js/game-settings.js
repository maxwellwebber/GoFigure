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

    cookieUsername = getCookie('Gousername');

    // default game settings
    var object = {
        userName: cookieUsername,
        gameSettings: {
            scoringSettings: "Area Scoring",
            playerSettings: "One Player",
            handicapSettings: "Zero",
            boardSize: 13
        }
    }

    // below functions are used to change different game settings
    $('.scoring-settings').click(function() {
        object.gameSettings.scoringSettings = $(this).text().trim();
    });

    $('.player-settings').click(function() {
        object.gameSettings.playerSettings = $(this).text().trim();
    });

    $('.handicap-settings').click(function() {
        object.gameSettings.handicapSettings = $(this).text().trim();

    });

    $('.board-size-settings').click(function() {
        object.gameSettings.boardSize = Number($(this).text().trim().split('x')[0]);

    });

    // used to save game settings
    $('.start-button').click(function() {
        clientServer.sendData(object, "setGame", function(status) {});

    });


});