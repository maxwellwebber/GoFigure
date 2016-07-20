$(document).ready(function() {

    var clientServer = new ClientServer("localhost", 80);

    var userName = document.cookie.split('=')[1];
    
    var replays = clientServer.getReplays(userName)
    
    
    
    
    
});