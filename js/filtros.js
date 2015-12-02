function generarFiltros() {
    var filtroMinis = $("#filtro-minis");
    var filtroMinisHtml = filtroMinis.html();
    var ministerios = $("path.depth1");
    
    var filtroAyuda = $("#filtro-ayuda");
    var filtroAyudaHtml = filtroAyuda.html();
    var productos = $("path.depth2");

    var filtroEvento = $("#filtro-evento");
    var filtroEventoHtml = filtroEvento.html();

    // Generar Filtros por Ministerio
    for (var i=0; i<ministerios.length; i++) {
        var minisClass = d3.select(ministerios[i]).attr("class").split(" ")[1];
        var minisName = d3.select(ministerios[i])[0][0].__data__.name;
        var checkbox = "<div class='checkbox'><label><input type='checkbox' value='" + 
                       minisClass + 
                       "' name='ministerios'>" + 
                       minisName + "</label></div>";
        filtroMinisHtml += checkbox;
    }
    filtroMinis.html(filtroMinisHtml);

    var tiposAyuda = {};
    // Generar Objeto con todos los tipos de ayuda
    // TODO: más fácil hacer con array como hice con eventos!
    for (var i=0; i<productos.length; i++) {
        var ayudaClass = d3.select(productos[i]).attr("class").split(" ")[1];
        var ayudaName = d3.select(productos[i])[0][0].__data__.tipo_ayuda;
        var inArray = false;
        for (var j=0; j<Object.keys(tiposAyuda).length; j++) {
            if (ayudaClass == Object.keys(tiposAyuda)[j]) { inArray = true; }
        }
        if (!inArray) {
            tiposAyuda[ayudaClass] = ayudaName;
            var checkbox = "<div class='checkbox'><label><input type='checkbox' value='" + 
                           ayudaClass + 
                           "' name='tipo_ayuda'>" + 
                           ayudaName + "</label></div>";
            filtroAyudaHtml += checkbox;
        }
    }
    filtroAyuda.html(filtroAyudaHtml);

    var eventos = [];
    // Generar array con todos los eventos
    for (var i=0; i<productos.length; i++) {
        var eventoName = d3.select(productos[i])[0][0].__data__.evento;
        // If evento no está en array
        if (eventoName != "") {
            if (eventos.indexOf(eventoName) == -1) {
                eventos.push(eventoName);
                var checkbox = "<div class='checkbox'><label><input type='checkbox' value='" + 
                               generarInitials(eventoName) + 
                               "' name='evento'>" + 
                               eventoName + "</label></div>";
                filtroEventoHtml += checkbox;
            }    
        }
    }
    filtroEvento.html(filtroEventoHtml);
}

function filtrarProductos() {
    var ministeriosCh = $("input[name=ministerios]");
    var tiposAyudaCh = $("input[name=tipo_ayuda]");
    var eventosCh = $("input[name=evento]");
    
    var mostrarTodosMinis = false, 
        mostrarTodosAyuda = false,
        mostrarTodosEventos = false;

    // Si estan todos destilados, no hay filtro!
    var minisUnchecked = $("input[name=ministerios]:not(:checked)");
    if ( minisUnchecked.length == ministeriosCh.length ) {
        mostrarTodosMinis = true;
    }

    var ayudaUnchecked = $("input[name=tipo_ayuda]:not(:checked)");
    // Si estan todos destildados, no hay filtro
    if ( ayudaUnchecked.length == tiposAyudaCh.length ) {
        mostrarTodosAyuda = true;
    }

    var eventosUnchecked = $("input[name=evento]:not(:checked)");
    // Si estan todos destildados, no hay filtro
    if ( eventosUnchecked.length == eventosCh.length ) {
        mostrarTodosEventos = true;
    }

    ministeriosCh.each(function() {
        var minisChecked = $(this).prop("checked");
        var minisClass = $(this).val();

        var minisPath = $("path.depth1." + minisClass);
        if (mostrarTodosMinis || minisChecked) {
            minisPath.show();       
        } else {
            minisPath.hide();
            $(getProductos(minisPath[0])).hide();
        }
        
        tiposAyudaCh.each(function() {
            var ayudaChecked = $(this).prop("checked");
            var ayudaClass = $(this).val();
    
            var mostrarEventos = false;
            var eventosChecked = [];
            eventosCh.each(function() {
                var eventoChecked = $(this).prop("checked");
                var eventoName = $(this).val();
                if (eventoChecked) { eventosChecked.push(eventoName); }
            });

            var productosMinis = getProductos(minisPath[0]);
            for (var i=0; i<productosMinis.length; i++) {
                var currentProducto = productosMinis[i];
                var productoClass = currentProducto.classList[1];
                var productoEvento = generarInitials(currentProducto.__data__.evento);

                if (mostrarTodosEventos || eventosChecked.indexOf(productoEvento) != -1) {
                    mostrarEventos = true;
                } else {
                    mostrarEventos = false;
                }

                if ((ayudaChecked && minisChecked && (ayudaClass == productoClass) && mostrarEventos) || 
                    (ayudaChecked && mostrarTodosMinis && (ayudaClass == productoClass) && mostrarEventos) ||
                    (mostrarTodosAyuda && minisChecked && mostrarEventos) ||
                    (mostrarTodosAyuda && mostrarTodosMinis && mostrarEventos)) 
                {
                    $(currentProducto).show();
                } 
                if ((!ayudaChecked && !mostrarTodosAyuda && (ayudaClass == productoClass)) || 
                    (!minisChecked && !mostrarTodosMinis && (ayudaClass == productoClass)) ||
                    (!mostrarEventos)) 
                { 
                    $(currentProducto).hide();
                }
            }
        });
    });

}