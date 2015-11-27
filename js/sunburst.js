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
        var ayuda = "";
        if ("tipo_ayuda" in d) {
          var initials = [];
          var words = d.tipo_ayuda.split(" ");
          for (var i=0; i < words.length; i++) {
            var initial = words[i].split("")[0].toLowerCase();
            initials.push(initial);
          }
          ayuda = initials.join("");
        }
        return "depth" + d.depth + " " + ayuda 
      })
      .style("stroke", "#fff")
      .style("fill-rule", "evenodd")
      .on("mouseover", function(d) {
        $("#tooltip").show();
        var explicativo = "";
        if ("tipo_ayuda" in d) {
          explicativo = d.name + ": " + d.tipo_ayuda;
        } else {
          explicativo = d.name;
        }
        var htmlStr = "<div style='font-size: 10px; text-transform: uppercase; color: #999999;'> " + explicativo + " </div>";
        console.log(d);
        $("#tooltip").html(htmlStr);
      })
      .on("mouseout", function() {
        $("#tooltip").hide();
      })
      .on("mousemove", function() {
        $("#tooltip").show();
        d3.select("#tooltip")
            .attr("style",
                function() {
                    return "left:" + (mousePos[0] - 250) + "px; top:" + (mousePos[1] - 150) + "px";
                }
            );
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