$(document).ready(function() {


//alert($('#token-color input[name=select-token-color]:checked').val()); 


$('.token-color').click(function() {
   console.log($(this).text().trim()); 
   visualSettings.tokenColor = $(this).text().trim();
});



});

var visualSettings = {
    
    tokenColor : "Black and White",
    tokenShape: "Circle",
    boardColor: "Brown"
    
}