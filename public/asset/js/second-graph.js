import axios from "axios"
// set the dimensions and margins of the graph
let margin = { top: 10, right: 30, bottom: 30, left: 60 }
let width = 800 - margin.left - margin.right
let height = 400 - margin.top - margin.bottom



const generateLineChart = (data) => {

    const packData = data.reduce((acc, item) => {
        if (item.gpd !== null) {

            const exist = acc.find(part => part.country === item.country)

            exist ? exist.values.push({
                year: item.year,
                gpd: item.gpd
            }) : acc.push({
                country: item.country,
                values: [{
                    year: item.year,
                    gpd: item.gpd
                }]
            })
        }


        return acc
    }, [])

    const dataReadyToUse = packData.map(item => {
        item.values.sort((a, b) => a.year - b.year)
        return item
    })


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

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    let y = d3.scaleLinear()
        .domain([0, 5000000000000])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll(".line")
        .data(dataReadyToUse)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "#e41a1c")
        .attr("stroke-width", 1.5)
        .attr("d", (d) => {
            return d3.line()
                .x((d) => {
                    return x(d.year)
                })
                .y((d) => y(+d.gpd))
                (d.values)
        })
}


(async () => {
    const { data } = await axios.get(process.env.VPS + '/gpd-europe')

    generateLineChart(data)
})()