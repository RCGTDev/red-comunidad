var lockTooltip = false;

$("#tooltip").hide();

var width = 600,
    height = 500,
    radius = Math.min(width, height) / 2;

var svg = d3.select("#viz").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height * .5 + ")");

var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return 1; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

d3.json("data/red-comunidad.json", function(error, root) {
  if (error) throw error;

  var path = svg.datum(root).selectAll("path")
      .data(partition.nodes)
    .enter().append("path")
      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      .attr("d", arc)
      .attr("class", function(d) { 
        var clase = "depth" + d.depth;
        if ("tipo_ayuda" in d) {
          var ayuda = generarInitials(d.tipo_ayuda);
          clase += " " + ayuda;
        } else {
          var ministerio = generarInitials(d.name);
          clase += " " + ministerio;
        }
        return clase; 
      })
      .style("stroke", "#fff")
      .style("fill-rule", "evenodd")
      .on("mouseover", function(d) {
        // Si no hay un path seleccionado, se puede seguir hovereando
        if (!lockTooltip) { 
          document.body.style.cursor = "pointer";
          // Highlightear path que se este haciendo hover
          d3.selectAll("path").style("opacity", 0.2)
          d3.select(this).style("opacity", 1);

          // Mostrar tooltip con info correspondiente
          $("#tooltip").show();
          
          var source = "";
          var dataTemplate = {};
          if ("tipo_ayuda" in d) {
            var ministerios = getMinisterios(this);
            d3.selectAll(ministerios).style("opacity", 1);
            var areas = [];
            for (var i=0; i<ministerios.length; i++) {
              areas.push(ministerios[i].__data__.name);
            }
            var equipos = d.area.split(";");
            dataTemplate = { "name": d.name, 
                             "bajada": d.bajada,
                             "areas": areas,
                             "equipos": equipos,
                             "evento": d.evento };
            // Compile template de tooltip de producto
            source = $("#tooltip-producto").html();
            
          } else {
            var productos = getProductos(this);
            d3.selectAll(productos).style("opacity", 1);

            // Compile template de tooltip de ministerio
            source = $("#tooltip-ministerio").html();
            dataTemplate = {"name": d.name, 
                            "cant_proyectos": d.children.length}
          }
          var template = Handlebars.compile(source);
          var htmlStr = template(dataTemplate);
          $("#tooltip").html(htmlStr); 
        } else if ((lockTooltip && d.name != $(".tooltip-content #name").html()) &&
                   (lockTooltip && d.name != $(".tooltip-content #name a").html())){
          // Hay un path seleccionado
          document.body.style.cursor = "default";
        } else {
          document.body.style.cursor = "pointer";
        }
      })
      .on("click", function(d) {
        if (!lockTooltip) { 
          lockTooltip = true; 
          // Disable filtros
          disableFiltros();
        } else { 
          if (d.name == $(".tooltip-content #name a").html() || 
              d.name == $(".tooltip-content #name").html()) {
            lockTooltip = false; 
            d3.selectAll("path.depth1, path.depth2").style("opacity", 1); 
            $("#tooltip").hide();
            enableFiltros();
          }
        }
      })
      .on("mouseout", function(d) {
        document.body.style.cursor = "default";
        if (!lockTooltip) {
          d3.selectAll("path.depth1, path.depth2").style("opacity", 1);   
          $("#tooltip").hide();
          enableFiltros();
        }
      });

  generarFiltros();

  $("input[name=ministerios], input[name=tipo_ayuda], input[name=evento]").change(function() {
      filtrarProductos();
  });

  // Mostrar footer una vez que está todo cargado
  $("footer").show();
});

// Interpolate the arcs in data space.
function arcTween(a) {
  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
  return function(t) {
    var b = i(t);
    a.x0 = b.x;
    a.dx0 = b.dx;
    return arc(b);
  };
}

d3.select(self.frameElement).style("height", height + "px");

function cerrarTooltip() {
  d3.selectAll("path.depth1, path.depth2").style("opacity", 1); 
  lockTooltip = false;
  $("#tooltip").hide();
}

function disableFiltros() {
  $("input[type='checkbox']").attr("disabled", true);
  $("input[type='checkbox']").parent().css("color", "#999999").css("cursor", "default");
  $("div.filtros h4").css("color", "#999999").css("cursor", "default");
}

function enableFiltros() {
  $("input[type='checkbox']").attr("disabled", false);
  $("input[type='checkbox']").parent().css("color", "#333333").css("cursor", "pointer");
  $("div.filtros h4").css("color", "#333333").css("cursor", "pointer"); 
}