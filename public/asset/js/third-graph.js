import axios from "axios"
const slider = document.getElementById("slider-third-graph")
const svgContainer = document.getElementById("third-graph")


const width = 800
const height = 400
const colors = {
    Asia: '#F16529',
    Americas: '#1C88C7',
    Africa: '#FCC700',
    Oceania: '#C6C6C6',
    Europe: '#A4A4A4',
    unknown: '#000000',
};

const generateSecondGraph = data => {

    const bubble = data => d3.pack()
        .size([width, height])
        .padding(2)(d3.hierarchy({ children: data }).sum(d => d.nbAthlete));

    let svg = d3.select("#third-graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height)


    const root = bubble(data);

    const node = svg.selectAll()
        .data(root.children)
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);

    node.append('circle')
        .style('fill', d => colors[d.data.continent])
        .attr('r', d => d.r);

    node.append('text')
        .attr('dy', 2)
        .text(d => d.data.continent.substring(0, d.r / 3));

    node.append("title")
        .text(d => d.data.continent);





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

