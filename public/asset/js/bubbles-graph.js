import axios from "axios"
const slider = document.getElementById("slider-third-graph")
const svgContainer = document.getElementById("third-graph")


const width = 800
const height = 400
const colors = {
    Asia: '#B4D6FF',
    Americas: '#F92B49',
    Africa: '#D3DCE5',
    Oceania: '#FD4C4C',
    Europe: '#7C9FFF',
};

const generateSecondGraph = data => {

    data = data.filter(c => c.continent !== "unknown")

    const bubble = data => d3.pack()
        .size([width, height])
        .padding(15)(d3.hierarchy({ children: data }).sum(d => d.nbAthlete));

    let svg = d3.select("#third-graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height)


    const root = bubble(data);
    console.log('data:', data)

    const node = svg.selectAll()
        .data(root.children)
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);

    node.append('circle')
        .style('fill', 'none')
        .style("stroke", d => colors[d.data.continent])
        .style("stroke-width", 10)
        .attr('r', d => d.r);

    node.append('text')
        .attr('dy', -8)
        .text(d => d.data.nbAthlete)
        .attr("text-anchor", "middle")
        .attr("font-family", "Poppins")
        .attr("font-weight", "600")
        .style('fill', d => colors[d.data.continent])

    node.append('text')
        .attr('dy', 8)
        .text(d => d.data.continent.substring(0, d.r / 3))
        .attr("text-anchor", "middle")
        .attr("font-family", "Poppins")
        .style('fill', d => colors[d.data.continent])

    node.append('title')
        .text(d => d.data.continent + ' : ' + d.data.nbAthlete)





};

(async () => {

    const { data } = await axios.get(process.env.VPS + '/athletes-by-continent?year=' + slider.value)
    generateSecondGraph(data)

    slider.addEventListener("mouseup", async () => {
        const svg = svgContainer.children[0]

        if (svgContainer.children.length > 0) svg.remove()

        const { data } = await axios.get(process.env.VPS + '/athletes-by-continent?year=' + slider.value)
        generateSecondGraph(data)
    })
})()

// Font axis poppins 11 semi bold
// FOnt text axis 14
// FOnt text axis 14


