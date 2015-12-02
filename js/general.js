$(document).ready(function() {
    $("button.boton-viz").on("click", function(){
        $("div#contenido-inicial").fadeOut(500, complete=function() {
            $("div#contenido-posta").fadeIn(500);
        });
    }); 
});