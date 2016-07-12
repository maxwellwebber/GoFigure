$(document).ready(function() {

    var clientServer = new ClientServer("localhost", 80);
    
    var object = {
        
        userName : "userName",
        visualSettings : {
            tokenColor : "Black and White",
            tokenShape: "Circle",
            boardColor: "Brown"
        }
    }
    
    object.userName = document.cookie.split("=")[1];
    

    
    $('.token-color').click(function() {
       object.visualSettings.tokenColor = $(this).text().trim();
        
    });
    
    $('.token-shape').click(function() {
       
       object.visualSettings.tokenShape = $(this).text().trim();
       //console.log(visualSettings); 
    });
    
    $('.board-color').click(function() {
       object.visualSettings.boardColor = $(this).text().trim();
    
    });

    $('.save-button').click(function() {
        console.log(document.cookie);
        clientServer.sendData(object,"setVisualSettings", function(status) {
            // do error checking with status parameter here
        });
    });
    
    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
});

