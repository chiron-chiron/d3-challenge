// @TODO: YOUR CODE HERE!

var svgWidth = 900;
var svgHeight = 500;
var margin = {
    top: 20,
    right: 40,
    bottom: 40,
    left: 50,
};

var labelArea = 110;
var width = parseInt(d3.select("#scatter").style("width"));

// Designate the height of the graph
var height = width - width / 3.9;


var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Creating SVG wrapper, adding SVG group for chart
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// var svg = 
svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
// svg.append("g").attr("translate(" + (width -400) + ", " + (height + margin.top + 20) + ")");
    // .attr("transform", function(d) {return "translate(" + ((width - 400) + "," + (height + margin.top + 20) + ")"})


// Loading data
d3.csv("data.csv").then((incomingData) => {

    // Parsing data as numbers
    incomingData.forEach((data) => {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    var data = incomingData;
    console.log(data);

    // Creating scale
    var xLinearScale = d3.scaleLinear()
        .domain([10, d3.max(data, d => d.poverty) + 2])
        .range([0, width]);
    var yLinearScale = d3.scaleLinear()
        .domain([4, d3.max(data, d => d.healthcare) + 3])
        .range([height, 0]);
    
    // Creating axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

        // Appending axes to chart
        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

        svg.append("g")
        .call(leftAxis);


    // Creating axes labels
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare %");

    // // Import layout from D3 library
    // var pack = d3.layout.pack()
    //     .size([width, height - 50])

    svg.append("text")
        // .attr("transform", `translate(${width - 400}, ${height + margin.top + 20})`)
        .attr("transform", "translate(0," + (height - margin.top - labelArea) + ")")
        .attr("class", "axisText")
        .text("In Poverty %");
    
    
    // Creating circles
    var circlesGroup = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("class", "stateCircle");
    
    // Creating circle labels
    var circleLabels = svg.selectAll(null)
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => {return xLinearScale(d.poverty)})
        .attr("y", d => {return yLinearScale(d.healthcare)})
        .text(function (d) {return d.abbr})
        .attr("font-size", "9px")
        .attr("class", "stateText");
    
    // Creating Title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", -6)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("text-decoration", "underline")
        .text("Lacks Healthcare % vs In Poverty (State) %");
    
    // Creating Tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
            return(`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
        });
    svg.call(toolTip);

    // Creating event listeners for Tooltip
    circlesGroup.on("click", function (date) {
        toolTip.show(data, this);
    })
        // Event: Mouse out
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });
});