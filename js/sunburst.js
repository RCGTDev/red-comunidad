$("#tooltip").hide();

var width = 600,
    height = 500,
    radius = Math.min(width, height) / 2;

var svg = d3.select("#container").append("svg")
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

  var mousePos = [];

  $(document).mousemove(function(event) {
      mousePos[0] = event.clientX;
      mousePos[1] = event.clientY;
  });

  var path = svg.datum(root).selectAll("path")
      .data(partition.nodes)
    .enter().append("path")
      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      .attr("d", arc)
      .attr("class", function(d) { 
        var clase = "depth" + d.depth;
        if ("tipo_ayuda" in d) {
          var initials = [];
          var words = d.tipo_ayuda.split(" ");
          for (var i=0; i < words.length; i++) {
            var initial = words[i].split("")[0].toLowerCase();
            initials.push(initial);
          }
          ayuda = initials.join("");
          clase += " " + ayuda;
        }
        return clase; 
      })
      .style("stroke", "#fff")
      .style("fill-rule", "evenodd")
      .on("mouseover", function(d) {
        // Highlightear path que se este haciendo hover
        d3.selectAll("path").style("opacity", 0.2)
        d3.select(this).style("opacity", 1);
        
        // Mostrar tooltip con info correspondiente
        $("#tooltip").show();
        d3.select("#tooltip")
          .attr("style", function() {
            return "left:" + (mousePos[0] - 150) + "px; top:" + (mousePos[1] - 210) + "px";
          }
        );
        var htmlStr = "";
        if ("tipo_ayuda" in d) {
          htmlStr = "<div class='tooltip-content'>" + 
                    "<span class='tooltip-esc'>X</span>" + 
                    "<span class='tooltip-titulo'>Proyecto</span>" +
                    "<span class='tooltip-value'>" + d.name + "</span>" +
                    "<span class='tooltip-titulo'>Tipo de colaboración</span>" +
                    "<span class='tooltip-value'>" + d.tipo_ayuda + "</span></div>";
        } else {
          // El hover es sobre un Ministerio
          htmlStr = "<div class='tooltip-content'>" + 
                    "<span class='tooltip-esc'>X</span>" +
                    "<span class='tooltip-titulo'>Ministerio</span>" +
                    "<span class='tooltip-value'>" + d.name + "</span>" +
                    "<span class='tooltip-titulo'>Cantidad de proyectos</span>" +
                    "<span class='tooltip-value'>" + d.children.length + "</span></div>";

          var paths = $("path");
          for (var i=0; i<paths.length; i++) {
            var currentPath = paths[i];
            var productParent = d3.select(currentPath)[0][0].__data__.parent;
            var ministerioName = d3.select(this)[0][0].__data__.name;
            if (productParent) {
              if (productParent.name == ministerioName) {
                d3.select(paths[i]).style("opacity", 1);  
              }  
            }
          }
        }
        
        console.log(d);
        $("#tooltip").html(htmlStr);
      })
      .on("mouseout", function(d) {
        d3.selectAll($("path")).style("opacity", 1);
      });

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

$(".tooltip-esc").click(function() {
  $("#tooltip").hide();
});