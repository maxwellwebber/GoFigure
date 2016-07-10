$(document).ready(function() {
    
    var clientServer = new ClientServer("localhost", 80);
    
    var newUser = {
        userName: "userName",
        password: "password"
    }
    
 // 
    
    $(".register-button").click(function() {
        //alert("create account");
        newUser.userName = $(".username-field").val();
        newUser.password = $(".password-field").val();
        //alert("Name is :" + name+" "+ "Password is: " + password);
        clientServer.sendData(newUser, "makeAccount", function(response){
           console.log(response);
        });
    });
    
    $(".login-button").click(function() {
        console.log("LOGGED IN!!!!");
    });
});