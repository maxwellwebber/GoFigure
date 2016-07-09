$(document).ready(function() {

    var clientServer = new ClientServer("localhost", 80);
    var visualSettings = {
        
        tokenColor : "Black and White",
        tokenShape: "Circle",
        boardColor: "Brown"
        
    }

    $('.token-color').click(function() {
       visualSettings.tokenColor = $(this).text().trim();
        
    });
    
    $('.token-shape').click(function() {
       
       visualSettings.tokenShape = $(this).text().trim();
       //console.log(visualSettings); 
    });
    
    $('.board-color').click(function() {
       visualSettings.boardColor = $(this).text().trim();
    
    });

    $('.save-button').click(function() {
        clientServer.sendData(visualSettings,"visualSettings", function(status) {
            // do error checking with status parameter here
        });
    });
    

});