const width = 800
const height = 700
const margin = {
    top: 10, 
    bottom: 40, 
    left: 40, 
    right: 10
}

const svg = d3.select("div#chart").append("svg").attr("width", width).attr("height", height)
const elementGroup = svg.append("g").attr("id", "elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)
const axisGroup = svg.append("g").attr("id", "axisGroup")
const xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

const x = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(0.1)
const y = d3.scaleLinear().range([height - margin.bottom - margin.top, 0]) 

const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)
const colorArray = ["blue", "green", "grey","yellow","red"]
let maxvalues = []
let namesvalues = []

d3.csv("WorldCup.csv").then(data => {
    data.map(d => d.Year = +d.Year)

    let nest = d3.nest()
      .key(d => d.Winner)
      .entries(data)
  
    for (const key of nest) {
      maxvalues.push(key.values.length)
      namesvalues.push(key)
    }
    console.log(namesvalues)
    
    x.domain(data.map(d => d.Winner))
    y.domain([0, d3.max(maxvalues)])

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis.ticks(5).tickSize(-width))

    let elements = elementGroup.selectAll("rect").data(namesvalues)
    if(d3.max(maxvalues) == colorArray.length){
      elements.enter().append("rect")
        .attr("x", d => x(d.values[0].Winner))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.top - margin.bottom - y(d.values.length))
        .attr("y", d => y(d.values.length))
        .attr("fill", d => colorArray[parseInt((d.values.length)-1)])
    }else{
      elements.enter().append("rect")
        .attr("class", "bar", d => x(d.values[0].Winner))
        .attr("x", d => x(d.values[0].Winner))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.top - margin.bottom - y(d.values.length))
        .attr("y", d => y(d.values.length))
    }


})