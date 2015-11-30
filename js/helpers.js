function generarInitials(palabras) {
    var initialsArray = [];
    var initials = "";
    var words = palabras.split(" ");
    for (var i=0; i < words.length; i++) {
        var twoInitial = words[i].split("").splice(0,2);
        if (twoInitial) { twoInitial = twoInitial.join("").toLowerCase(); }
        initialsArray.push(twoInitial);
    }
    initials = initialsArray.join("");
    return initials;
}

function getMinisterios(producto) {
    var ministerios = [];
    var paths = $("path");
    for (var i=0; i<paths.length; i++) {
        // Queremos highlightear el ministerio al que corresponde el producto
        var currentPath = paths[i];
        var ministerioChildren = d3.select(currentPath)[0][0].__data__.children;
        var projectName = d3.select(producto)[0][0].__data__.name;
        if (ministerioChildren) {
          var esMinisterio = false;
          for (var j=0; j<ministerioChildren.length; j++) {
            if (ministerioChildren[j].name == projectName) {
              esMinisterio = true;
            } 
          }
          if (esMinisterio) {
            ministerios.push(currentPath);  
          }
        }
    }
    return ministerios;
}

function getProductos(ministerio) {
    var productos = [];
    var paths = $("path");
    for (var i=0; i<paths.length; i++) {
        // Queremos highlightear los productos que se hicieron con este ministerio
        var currentPath = paths[i];
        var productParent = d3.select(currentPath)[0][0].__data__.parent;
        var ministerioName = d3.select(ministerio)[0][0].__data__.name;
        if (productParent) {
            if (productParent.name == ministerioName) {
                productos.push(currentPath);
            }  
        }
    }
    return productos;
}