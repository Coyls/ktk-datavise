
import axios from "axios";
const slider = document.getElementById("slider-first-graph")
const svgContainer = document.getElementById("first-graph")

// set the dimensions and margins of the graph
let margin = { top: 50, right: 120, bottom: 30, left: 60 }
let width = (window.innerWidth <= 1475) ? 700 - margin.left - margin.right : 800 - margin.left - margin.right
let height = 400 - margin.top - margin.bottom

const styleAxis = (svg) => {
    svg.selectAll(".domain")
        .attr("stroke", "#7C9FFF")
        .attr("stroke-width", "2")

    svg.selectAll(".tick text")
        .attr("font-size", "14")
        .attr("font-family", "Poppins")
        .attr("font-weight", "600")
        .style('fill', "#7C9FFF")

    svg.selectAll(".tick line")
        .attr("stroke", "transparent");

}


const generateFirstGraph = (data) => {
    // append the svg object to the body of the page
    let svg = d3.select("#first-graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Add X axis
    let x = d3.scaleLinear()
        .domain([0, 13000000])
        .range([0, width]);

    let xAxis = d3.axisBottom(x);

    xAxis.ticks(7)
        .tickSize(10)
        .tickFormat(d3.format(".2s"))

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("y", -35)
        .attr("x", 40)
        .text("Nombre de ")
        .attr("font-size", "14")
        .attr("font-family", "Poppins")
        .attr("font-weight", "600")
        .style('fill', "#7C9FFF")

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("y", -15)
        .attr("x", 40)
        .text("médailles")
        .attr("font-size", "14")
        .attr("font-family", "Poppins")
        .attr("font-weight", "600")
        .style('fill', "#7C9FFF")


    // Add Y axis
    let y = d3.scaleLinear()
        .domain([0, 70])
        .range([height, 0]);

    let yAxis = d3.axisLeft(y);

    yAxis.ticks(6)
        .tickSize(10)

    svg.append("g")
        .call(yAxis);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("y", height)
        .attr("x", width + margin.right / 2 - 10)
        .text("Budjet en")
        .attr("font-size", "14")
        .attr("font-family", "Poppins")
        .attr("font-weight", "600")
        .style('fill', "#7C9FFF")

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("y", height + 16)
        .attr("x", width + margin.right / 2 - 10)
        .text("millions d'€")
        .attr("font-size", "14")
        .attr("font-family", "Poppins")
        .attr("font-weight", "600")
        .style('fill', "#7C9FFF")

    styleAxis(svg)

    // TEXT pays
    const countryHover = svg.append("text")
        .attr("text-anchor", "end")
        .attr("y", -16)
        .attr("x", width + margin.right / 2)
        .text("Pays")
        .attr("font-size", "16")
        .attr("font-family", "Poppins")
        .attr("font-weight", "600")
        .style('fill', "#7C9FFF")

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => { return x(d.budjet * 1000); })
        .attr("cy", (d) => { return y(d.medals); })
        .attr("r", 12)
        .style("fill", "#B4D6FF")
        .style("cursor", "pointer")
        .on('mouseover', function (d) {
            d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 16)
            countryHover.text(d.country + " : " + d.medals)
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 12)
        })












}



(async () => {
    const spanSlider = document.getElementById('year-g-1')
    spanSlider.innerText = slider.value

    const { data } = await axios.get(process.env.VPS + '/medals-and-budjet?year=' + slider.value)
    generateFirstGraph(data)
    console.log('data:', data)

    slider.addEventListener("mouseup", async () => {
        const svg = svgContainer.children[0]
        spanSlider.innerText = slider.value

        if (svgContainer.children.length > 0) svg.remove()

        const { data } = await axios.get(process.env.VPS + '/medals-and-budjet?year=' + slider.value)
        generateFirstGraph(data)
    })
})()
