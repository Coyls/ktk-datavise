import axios from "axios"
// set the dimensions and margins of the graph
let margin = { top: 50, right: 110, bottom: 30, left: 70 }
let width = (window.innerWidth <= 1475) ? 700 - margin.left - margin.right : 800 - margin.left - margin.right
let height = 400 - margin.top - margin.bottom


const colors = {
    Asia: '#B4D6FF',
    Americas: '#F92B49',
    Africa: '#D3DCE5',
    Oceania: '#FD4C4C',
    Europe: '#7C9FFF',
};

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


const generateLineChart = (data) => {

    let svg = d3.select("#second-graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Add X axis
    let x = d3.scaleTime()
        .domain([1960, 2020])
        .range([0, width]);

    let xAxis = d3.axisBottom(x);

    xAxis.ticks(7)
        .tickSize(10)
        .tickFormat(d3.format(".4"))

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("y", -35)
        .attr("x", 12)
        .text("PIB")
        .attr("font-size", "16")
        .attr("font-family", "Poppins")
        .attr("font-weight", "600")
        .style('fill', "#7C9FFF")

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("y", -15)
        .attr("x", 48)
        .text("(en Trillion d'€)")
        .attr("font-size", "12")
        .attr("font-family", "Poppins")
        .attr("font-weight", "600")
        .style('fill', "#7C9FFF")

    // Add Y axis
    let y = d3.scaleLinear()
        .domain([0, 40000000000000])
        .range([height, 0]);

    let yAxis = d3.axisLeft(y);

    yAxis.ticks(6)
        .tickSize(10)
        .tickFormat(d3.format(".2s"))

    svg.append("g")
        .call(yAxis);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("y", height + 5)
        .attr("x", width + margin.right / 2 - 10)
        .text("Années")
        .attr("font-size", "14")
        .attr("font-family", "Poppins")
        .attr("font-weight", "600")
        .style('fill', "#7C9FFF")


    styleAxis(svg)

    // Lines
    svg.selectAll(".line")
        .data(data)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", (d) => {
            console.log(d)
            return colors[d.continent]
        })
        .attr("stroke-width", 5)
        .style("cursor", "pointer")
        .attr("d", (d) => {
            return d3.line()
                .curve(d3.curveBasis)
                .x((d) => {
                    return x(d.year)
                })
                .y((d) => y(+d.gpd))
                (d.values)
        })
        .on('mouseover', function (d) {
            d3.select(this)
                .transition()
                .duration(100)
                .attr("stroke-width", 10)

            const lg = document.querySelector("." + d.continent)
            lg.classList.toggle("hover-line")

        })
        .on('mouseout', function (d) {
            d3.select(this)
                .transition()
                .duration(100)
                .attr("stroke-width", 5)
            const lg = document.querySelector("." + d.continent)
            lg.classList.toggle("hover-line")
        })


    d3.selectAll(".case-color")
        .on('mouseover', function () {
            const legend = d3.select(this)["_groups"][0][0]
            const continentClass = legend.classList[1]

            svg.selectAll("path")
                .transition()
                .duration(100)
                .attr("stroke-width", (d) => {
                    if (d === null) return 2
                    return (continentClass === d.continent) ? 10 : 5
                })

        })
        .on("mouseout", function () {
            d3.selectAll("path")
                .transition()
                .duration(100)
                .attr("stroke-width", (d) => (d === null) ? 2 : 5)
        })
}


(async () => {
    const { data } = await axios.get(process.env.VPS + '/gpd-continent')

    generateLineChart(data)
})()