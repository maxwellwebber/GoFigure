$(document).ready(function() {

    var clientServer = new ClientServer("localhost", 80);
    
    var object = {
        userName : document.cookie.split('=')[1],
        gameSettings : {
            scoringSettings : "Area",
            playerSettings: "One Player",
            handicapSettings: "Zero",
            boardSize: 13
        }
    }

    $('.scoring-settings').click(function() {
       object.gameSettings.scoringSettings = $(this).text().trim();
        
    });
    
    $('.player-settings').click(function() {
       
       object.gameSettings.playerSettings = $(this).text().trim();
       //console.log(visualSettings); 
    });
    
    $('.handicap-settings').click(function() {
       object.gameSettings.handicapSettings = $(this).text().trim();
    
    });
    
    $('.board-size-settings').click(function() {
       object.gameSettings.boardSize = Number($(this).text().trim().split('x')[0]);
    
    });

    $('.start-button').click(function() {
        clientServer.sendData(object,"setGame", function(status) {
            // do error checking with status parameter here
        });
        
    });
    

});