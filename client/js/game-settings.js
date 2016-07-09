$(document).ready(function() {

    var clientServer = new ClientServer("localhost", 80);
    var gameSettings = {
        
        scoringSettings : "Area",
        playerSettings: "One Player",
        boardSettings: "Zero"
        
    }

    $('.scoring-settings').click(function() {
       gameSettings.scoringSettings = $(this).text().trim();
        
    });
    
    $('.player-settings').click(function() {
       
       gameSettings.playerSettings = $(this).text().trim();
       //console.log(visualSettings); 
    });
    
    $('.handicap-settings').click(function() {
       gameSettings.handicapSettings = $(this).text().trim();
    
    });

    $('.start-button').click(function() {
        gameServer.sendData(gameSettings,"gameSettings", function(status) {
            // do error checking with status parameter here
        });
    });
    

});