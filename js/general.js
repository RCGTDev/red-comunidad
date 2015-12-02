$(document).ready(function() {
    $('body').click(function(evt){    
       if(evt.target.id == "group-viz")
          return;
       //For descendants of menu_content being clicked, remove this check if you do not want to put constraint on descendants.
       if($(evt.target).closest('#group-viz').length)
          return;             

        cerrarTooltip();
        enableFiltros();
    });

    $("#fullpage").show()
    $('#fullpage').fullpage();
    $("button.boton-viz, .flecha-down").on("click", function(){
        $.fn.fullpage.moveSectionDown();
    });
    $(".header-gcba .logo").on("click", function() {
        $.fn.fullpage.moveSectionUp();
    })
});