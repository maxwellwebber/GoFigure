$(document).ready(function() {
	// removes cookie and changes page when you press logout button
    $("#logout-button").click(function() {
        document.cookie = 'Gousername' + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
        window.location.pathname = "/index.html";
    });
});