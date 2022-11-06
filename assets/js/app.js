// @TODO: YOUR CODE HERE!

var svgWidth = 900;
var svgHeight = 500;
var margin = {
    top: 30,
    right; ,
    bottom: ,
    left: ,
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight = margin.top - margin.bottom;

// Creating SVG wrapper, adding SVG group for chart
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

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

    // Creating axes labels
    chart.Group.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

    // Appending axes to chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);
    
    // Creating circles
    var circlesGroup = chart.Group.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("class", "stateCircle");
    
    // Creating circle labels
    var circleLabels = chartGroup.selectAll(null)
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => {return xLinearScale(d.poverty)})
        .attr("y", d => {return yLinearScale(d.healthcare)})
        .text(function (d) {return d.abbr})
        .attr("font-size", "9px")
        .attr("class", "stateText");
    
    chartGroup.append("text")
        .attr("transform", `translate(${width - 420}, $(height + margin.top + 20})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
    
    // Creating Title
    chartGroup.append("text")
        .attr("x", (width / 2))
        .attr("y", -6)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Lacks Healthcare % vs In Poverty % by State");
    
    // Creating Tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
            return(`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
        });
    chartGroup.call(toolTip);

    // Creating event listeners for Tooltip
    circlesGroup.on("click", function (date) {
        toolTip.show(data, this);
    })
        // Event: Mouse out
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });
});