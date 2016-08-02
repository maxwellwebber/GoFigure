$(document).ready(function() {

    var clientServer = new ClientServer("localhost", 80);

    var newUser = {
        userName: "userName",
        password: "password"
    }

    $(".register-button").click(function() {
        newUser.userName = $(".username-field").val();
        newUser.password = $(".password-field").val();
        // used to register a new account
        clientServer.sendData(newUser, "makeAccount", function(response) {
            if (response === 401) {
                // error user already exists
                $("#user-prompt").css('color', 'white');
                $("#user-prompt").html("This username already exists. Please choose a new username.");
            } else {
                // success
                $("#user-prompt").css('color', 'white');
                $("#user-prompt").html("Your account has been created. Please log in with your new account");
            }
        });
    });

    // used to login
    $(".login-button").click(function() {
        var userName = $(".username-field").val();
        var password = $(".password-field").val();

        var user = {
            "userName": userName,
            "password": password
        }

        // authenticates user
        clientServer.sendData(user, "authenticate", function(response) {
            if (response === 401) {
                // invalid username or password
                $("#user-prompt").css('color', 'white');
                $("#user-prompt").html("Invalid username or password.");
            } else {
                //success
                $("#user-prompt").css('color', 'white');
                $("#user-prompt").html("Logging in");
                var d = new Date();
                d.setTime(d.getTime() + (4 * 60 * 60 * 1000));
                var expires = "expires=" + d.toUTCString();
                // sets new cookie
                document.cookie = "Gousername" + "=" + user.userName + "; " + expires;
                // changes page
                window.location.pathname = "/main-menu.html"
            }
        });


    });
});