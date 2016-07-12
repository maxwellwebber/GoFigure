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
           //console.log(response);
           if(response === 401){
               console.log(response);
               //$("#user-prompt").append("This username already exists. Please choose a new username.");
               $("#user-prompt").html("This username already exists. Please choose a new username.");
           }
           else{
               $("#user-prompt").html("Your account has been created. Please log in with your new account");
           }
        });
    });
    
    $(".login-button").click(function() {
        var userName = $(".username-field").val();
        var password = $(".password-field").val();
        
        var user = {
            "userName" : userName,
            "password" : password
        }
        
        clientServer.sendData(user, "authenticate", function(response){
           //console.log(response);
           if(response === 401){
               console.log(response);
               //$("#user-prompt").append("This username already exists. Please choose a new username.");
               $("#user-prompt").html("Invalid username or password.");
           }
           else{
               $("#user-prompt").html("Logging in");
               //put code to change page here
               console.log("THIS IS A VALID ACCOUNT, YOU ARE ABLE TO LOG IN");
               var d = new Date();
               d.setTime(d.getTime() + (4*60*60*1000));
               var expires = "expires="+ d.toUTCString();
               document.cookie = "Gousername" + "=" + user.userName + "; " + expires;
               window.location.pathname = "/main-menu.html"
           }
        });
        
        
    });
});
