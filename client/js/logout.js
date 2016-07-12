$(document).ready(function() {
    $("#logout-button").click(function() {
        document.cookie = 'Gousername' + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
        window.location.pathname = "/index.html";
    });
});