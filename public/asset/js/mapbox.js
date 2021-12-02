import countries from '../json/countries.json'
import capitals from '../json/capitals.json'
import axios from "axios"

const getCountryISO3 = require("country-iso-2-to-3");

mapboxgl.accessToken = 'pk.eyJ1Ijoibm9vb29vb29vb29vb29vb2UiLCJhIjoiY2t2aTN0OXFtMGZvYzJvbjBlYmNhcnJlbiJ9.7d0EuZjxcvKMFEuyVoEAnw'

const maxCoordinates = [[-169.7827071443, -58.7187007344], [-170.8033889302, 77.5153340433], [178.6670204285, 77.895585424], [179.6877022144, -57.778978041], [-169.7827071443, -58.7187007344]];

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/noooooooooooooooe/ckvi4aw5d1jsb14oak88v6scz", // style URL
    center: [3.5, 45], // starting position [lng, lat]
    zoom: 4,
    maxZoom: 5,
    minZoom: 1.5,
    pitch: 0,
    //maxBounds: maxCoordinates, // max coordinates
});

map.scrollZoom.disable();

map.addControl(new mapboxgl.NavigationControl());

let hoveredStateId = null;

const body = document.querySelector("body");
body.style.position = "fixed"

window.addEventListener('load', (e) => {
    body.style.position = "relative"
    document.getElementById('loading').remove()
});

map.on('load', () => {
    map.addSource('countries', {
        type: 'geojson',
        data: countries,
        generateId: true
    });

    map.addSource('capitals', {
        type: 'geojson',
        data: capitals,
        generateId: true
    });

    // Get the source
    const src = map.getSource('countries')._data.features

    const srcCapitals = map.getSource('capitals')._data.features

    ///////////////////////////////////////////// COUNTRIES HOVER //////////////////////////////////////////////////////

    map.addLayer({
        'id': 'countriesHover',
        'type': 'fill',
        'source': 'countries',
        'layout': {},
        'paint': {
            'fill-color': '#7799f4',
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.65,
                0
            ]
        }
    });

    map.on('mousemove', 'countriesHover', (e) => {
        if (e.features.length > 0) {
            if (hoveredStateId !== null) {
                map.setFeatureState(
                    {source: 'countries', id: hoveredStateId},
                    {hover: false}
                );
            }
            hoveredStateId = e.features[0].id;
            map.setFeatureState(
                {source: 'countries', id: hoveredStateId},
                {hover: true}
            );
        }
    });

    map.on('mouseleave', 'countriesHover', () => {
        if (hoveredStateId !== null) {
            map.setFeatureState(
                {source: 'countries', id: hoveredStateId},
                {hover: false}
            );
        }
        hoveredStateId = null;
    });

    ///////////////////////////////////////////////// DATE /////////////////////////////////////////////////////////////

    const slider = document.querySelector('#slider')

    const realDate = document.querySelector('#map .input-wrapper .realDate')

    slider.addEventListener("input", () => {
        realDate.innerHTML = slider.value
        setDate(slider, realDate)

        if (seasonsWrapperVerif) {

            medalsCountries().then()

        } else {

            if (firstWrapperGpdVerification || secondWrapperGpdVerification || thirdWrapperGpdVerification) {
                pibCountries().then()
            }

            if (firstWrapperMedalsVerification || secondWrapperMedalsVerification || thirdWrapperMedalsVerification) {
                medalsCountries().then()
            }

        }


    })

    function setDate(slider, realValue) {
        const val = slider.value
        const min = slider.min
        const max = slider.max
        let newVal = Number(((val - min) * 100) / (max - min));
        realValue.innerHTML = val
        realValue.style.left = newVal + "%"
    }

    //////////////////////////////////////////////// FUNCTION //////////////////////////////////////////////////////////

    function resetMap() {
        firstWrapperMedalsVerification = false
        secondWrapperMedalsVerification = false
        thirdWrapperMedalsVerification = false
        firstWrapperGpdVerification = false
        secondWrapperGpdVerification = false
        thirdWrapperGpdVerification = false

        firstWrapperGpd.style.border = "3px solid transparent"
        secondWrapperGpd.style.border = "3px solid transparent"
        thirdWrapperGpd.style.border = "3px solid transparent"
        firstWrapperMedals.style.border = "3px solid transparent"
        secondWrapperMedals.style.border = "3px solid transparent"
        thirdWrapperMedals.style.border = "3px solid transparent"

        firstWrapperGpdSpan.style.backgroundColor = "#B4D6FF"
        secondWrapperGpdSpan.style.backgroundColor = "#9DC2FF"
        thirdWrapperGpdSpan.style.backgroundColor = "#7C9FFF"

        firstWrapperMedals.classList.remove('active')
        secondWrapperMedals.classList.remove('active')
        thirdWrapperMedals.classList.remove('active')
        firstWrapperGpd.classList.remove('active')
        secondWrapperGpd.classList.remove('active')
        thirdWrapperGpd.classList.remove('active')

        medalsCountries().then()
        pibCountries().then()

        pibBigWrapper.classList.remove('active')
        medalsBigWrapper.classList.remove('active')

    }

    function startMap() {

        firstWrapperGpd.classList.add('active')
        firstWrapperGpdVerification = firstWrapperGpd.classList.contains('active')
        firstWrapperGpd.style.border = "3px solid #9EC3FF"
        pibBigWrapper.classList.add('active')

        if (seasonsWrapperVerif) {
            firstWrapperMedalsVerification = true
        }

        pibCountries().then()
        medalsCountries().then()
        switchPibMedals()

    }

    function switchPibMedals() {

        if (!seasonsWrapperVerif) {

            if (firstWrapperGpdVerification || secondWrapperGpdVerification || thirdWrapperGpdVerification) {
                if (!pibBigWrapper.classList.contains('active')) {
                    pibBigWrapper.classList.add('active')
                }
            } else {
                if (pibBigWrapper.classList.contains('active')) {
                    pibBigWrapper.classList.remove('active')
                }
            }

            if (firstWrapperMedalsVerification || secondWrapperMedalsVerification || thirdWrapperMedalsVerification) {
                if (!medalsBigWrapper.classList.contains('active')) {
                    medalsBigWrapper.classList.add('active')
                }
            } else {
                if (medalsBigWrapper.classList.contains('active')) {
                    medalsBigWrapper.classList.remove('active')
                }
            }

        }

    }

    ///////////////////////////////////////////// INTERACTION MAP //////////////////////////////////////////////////////

    const firstWrapperGpd = document.querySelector('#map .wrapper .map-info-wrapper .info-wrapper .pib-global-wrapper .first-wrapper')
    const secondWrapperGpd = document.querySelector('#map .wrapper .map-info-wrapper .info-wrapper .pib-global-wrapper .second-wrapper')
    const thirdWrapperGpd = document.querySelector('#map .wrapper .map-info-wrapper .info-wrapper .pib-global-wrapper .third-wrapper')

    const firstWrapperGpdSpan = document.querySelector('#map .wrapper .map-info-wrapper .info-wrapper .pibLegendWrapper .pib-global-wrapper .first-wrapper .first-span')
    const secondWrapperGpdSpan = document.querySelector('#map .wrapper .map-info-wrapper .info-wrapper .pibLegendWrapper .pib-global-wrapper .second-wrapper .second-span')
    const thirdWrapperGpdSpan = document.querySelector('#map .wrapper .map-info-wrapper .info-wrapper .pibLegendWrapper .pib-global-wrapper .third-wrapper .third-span')

    let firstWrapperGpdVerification = false
    let secondWrapperGpdVerification = false
    let thirdWrapperGpdVerification = false

    firstWrapperGpd.onclick = () => {

        if (!seasonsWrapperVerif) {

            firstWrapperGpd.classList.toggle('active')
            firstWrapperGpdVerification = firstWrapperGpd.classList.contains('active')
            firstWrapperGpdSpan.style.backgroundColor = "#B4D6FF"

            if (firstWrapperGpd.classList.contains('active')) {
                firstWrapperGpd.style.border = "3px solid #9EC3FF"
            } else {
                firstWrapperGpd.style.border = "3px solid transparent"
            }

            switchPibMedals()
            pibCountries().then()

        } else {

            firstWrapperGpd.classList.toggle('active')
            firstWrapperMedalsVerification = firstWrapperGpd.classList.contains('active');

            if (firstWrapperGpd.classList.contains('active')) {
                if (pibBigWrapper.classList.contains('active')) {
                    firstWrapperGpd.style.border = "3px solid #9EC3FF"
                } else {
                    firstWrapperGpd.style.border = "3px solid #FD4C4C"
                }
            } else {
                firstWrapperGpd.style.border = "3px solid transparent"
            }

            medalsCountries().then()

        }

    }

    secondWrapperGpd.onclick = () => {

        if (!seasonsWrapperVerif) {

            secondWrapperGpd.classList.toggle('active')
            secondWrapperGpdVerification = secondWrapperGpd.classList.contains('active')
            secondWrapperGpdSpan.style.backgroundColor = "#9DC2FF"

            if (secondWrapperGpd.classList.contains('active')) {
                secondWrapperGpd.style.border = "3px solid #9EC3FF"
            } else {
                secondWrapperGpd.style.border = "3px solid transparent"
            }

            pibCountries().then()
            switchPibMedals()

        } else {

            secondWrapperGpd.classList.toggle('active')
            secondWrapperMedalsVerification = secondWrapperGpd.classList.contains('active');

            if (secondWrapperGpd.classList.contains('active')) {
                if (pibBigWrapper.classList.contains('active')) {
                    secondWrapperGpd.style.border = "3px solid #9EC3FF"
                } else {
                    secondWrapperGpd.style.border = "3px solid #FD4C4C"
                }
            } else {
                secondWrapperGpd.style.border = "3px solid transparent"
            }

            medalsCountries().then()

        }

    }

    thirdWrapperGpd.onclick = () => {

        if (!seasonsWrapperVerif) {

            thirdWrapperGpd.classList.toggle('active')
            thirdWrapperGpdVerification = thirdWrapperGpd.classList.contains('active');
            thirdWrapperGpdSpan.style.backgroundColor = "#7C9FFF"

            if (thirdWrapperGpd.classList.contains('active')) {
                thirdWrapperGpd.style.border = "3px solid #9EC3FF"
            } else {
                thirdWrapperGpd.style.border = "3px solid transparent"
            }

            pibCountries().then()
            switchPibMedals()

        } else {

            thirdWrapperGpd.classList.toggle('active')
            thirdWrapperMedalsVerification = thirdWrapperGpd.classList.contains('active');

            if (thirdWrapperGpd.classList.contains('active')) {
                if (pibBigWrapper.classList.contains('active')) {
                    thirdWrapperGpd.style.border = "3px solid #9EC3FF"
                } else {
                    thirdWrapperGpd.style.border = "3px solid #FD4C4C"
                }
            } else {
                thirdWrapperGpd.style.border = "3px solid transparent"
            }

            medalsCountries().then()

        }

    }

    const firstWrapperMedals = document.querySelector('#map .wrapper .map-info-wrapper .info-wrapper .medals-global-wrapper .first-wrapper')
    const secondWrapperMedals = document.querySelector('#map .wrapper .map-info-wrapper .info-wrapper .medals-global-wrapper .second-wrapper')
    const thirdWrapperMedals = document.querySelector('#map .wrapper .map-info-wrapper .info-wrapper .medals-global-wrapper .third-wrapper')

    let firstWrapperMedalsVerification = false
    let secondWrapperMedalsVerification = false
    let thirdWrapperMedalsVerification = false

    firstWrapperMedals.onclick = () => {

        firstWrapperMedals.classList.toggle('active')
        firstWrapperMedalsVerification = firstWrapperMedals.classList.contains('active');

        if (firstWrapperMedalsVerification) {
            firstWrapperMedals.style.border = "3px solid #FD4C4C"
        } else {
            firstWrapperMedals.style.border = "3px solid transparent"
        }

        switchPibMedals()
        medalsCountries().then()

    }

    secondWrapperMedals.onclick = () => {

        secondWrapperMedals.classList.toggle('active')
        secondWrapperMedalsVerification = secondWrapperMedals.classList.contains('active');

        if (secondWrapperMedalsVerification) {
            secondWrapperMedals.style.border = "3px solid #FD4C4C"
        } else {
            secondWrapperMedals.style.border = "3px solid transparent"
        }

        switchPibMedals()
        medalsCountries().then()

    }

    thirdWrapperMedals.onclick = () => {

        thirdWrapperMedals.classList.toggle('active')
        thirdWrapperMedalsVerification = thirdWrapperMedals.classList.contains('active');

        if (thirdWrapperMedalsVerification) {
            thirdWrapperMedals.style.border = "3px solid #FD4C4C"
        } else {
            thirdWrapperMedals.style.border = "3px solid transparent"
        }

        switchPibMedals()
        medalsCountries().then()

    }

    const pibBigWrapper = document.querySelector('.pib-medals-wrapper .pib-wrapper')
    const medalsBigWrapper = document.querySelector('.pib-medals-wrapper .medals-wrapper')

    const mapInfoWrapper = document.querySelector('#map .wrapper')
    const arrowMap = document.querySelector('#map .wrapper .arrow-wrapper .wrapper')

    arrowMap.onclick = () => {
        mapInfoWrapper.classList.toggle('active')
        arrowMap.classList.toggle('active')
    }

    const seasonsWrapper = document.querySelector('#map .seasons-wrapper')
    const seasonsWrapperParagraph = document.querySelector('.seasons-wrapper p')

    const medalsLegendWrapper = document.querySelector('.medalsLegendWrapper')
    const pibLegendWrapperParagraph = document.querySelector('.pibLegendWrapper p')

    const pibBigWrapperParagraph = document.querySelector("#map .wrapper .map-info-wrapper .pib-medals-wrapper .pib-wrapper h4")
    const medalsBigWrapperParagraph = document.querySelector("#map .wrapper .map-info-wrapper .pib-medals-wrapper .medals-wrapper h4")

    let seasonsWrapperVerif = false
    const inputWrapper = document.querySelector("#map .map-info-wrapper .input-wrapper label input")

    seasonsWrapper.onclick = () => {
        seasonsWrapper.classList.toggle('active')
        seasonsWrapperVerif = seasonsWrapper.classList.contains('active')

        if (seasonsWrapperVerif) {
            resetMap()
            startMap()
            pibBigWrapper.classList.add("season")
            pibBigWrapper.classList.add("activeSeason")
            medalsBigWrapper.classList.add("season")
            seasonsWrapperParagraph.innerHTML = 'Pib / Médailles'
            pibBigWrapperParagraph.innerHTML = 'MÉDAILLES<br>SAISON HIVER'
            medalsBigWrapperParagraph.innerHTML = 'MÉDAILLES<br>SAISON ÉTÉ'
            pibLegendWrapperParagraph.innerHTML = 'Nombre de médailles'
            medalsLegendWrapper.style.display = 'none'

            map.setPaintProperty(
                'countriesPib',
                'fill-opacity',
                0,
            )

            map.setPaintProperty(
                'countriesCircle',
                'fill-opacity',
                0,
            )

            map.setPaintProperty(
                'countriesMedals',
                'fill-opacity',
                1,
            )

            inputWrapper.setAttribute("value", "1990")
            inputWrapper.setAttribute("step", "4")
            setDate(slider, realDate)

        } else {
            resetMap()
            startMap()
            pibBigWrapper.classList.remove("season")
            pibBigWrapper.classList.remove("activeSeason")
            medalsBigWrapper.classList.remove("season")
            medalsBigWrapper.classList.remove("activeSeason")
            seasonsWrapperParagraph.innerHTML = 'Carte des saisons'
            pibBigWrapperParagraph.innerHTML = 'PIB'
            medalsBigWrapperParagraph.innerHTML = 'MÉDAILLÉS'
            pibLegendWrapperParagraph.innerHTML = 'PIB par habitants en millions de dollars'
            medalsLegendWrapper.style.display = 'block'

            map.setPaintProperty(
                'countriesPib',
                'fill-opacity',
                1,
            )

            map.setPaintProperty(
                'countriesCircle',
                'fill-opacity',
                1,
            )

            map.setPaintProperty(
                'countriesMedals',
                'fill-opacity',
                0,
            )

            inputWrapper.max = 2020
            inputWrapper.value = 1990
            setDate(slider, realDate)
            inputWrapper.step = 2

        }

        medalsCountries().then()
        pibCountries().then()

    }

    pibBigWrapper.onclick = () => {

        if (!seasonsWrapperVerif) {

            if (pibBigWrapper.classList.contains('active')) {
                pibBigWrapper.classList.remove('active')
                firstWrapperGpd.classList.remove('active')
                secondWrapperGpd.classList.remove('active')
                thirdWrapperGpd.classList.remove('active')
                firstWrapperGpdVerification = firstWrapperGpd.classList.contains('active')
                secondWrapperGpdVerification = firstWrapperGpd.classList.contains('active')
                thirdWrapperGpdVerification = firstWrapperGpd.classList.contains('active')
                firstWrapperGpd.style.border = "3px solid transparent"
                secondWrapperGpd.style.border = "3px solid transparent"
                thirdWrapperGpd.style.border = "3px solid transparent"
            } else {
                firstWrapperGpd.classList.toggle('active')
                firstWrapperGpdVerification = firstWrapperGpd.classList.contains('active')
                firstWrapperGpd.style.border = "3px solid #9EC3FF"
                switchPibMedals()
            }

            pibCountries().then()

        } else {

            if (pibBigWrapper.classList.contains('active')) {

                resetMap()

                firstWrapperGpd.classList.add('active')
                firstWrapperMedalsVerification = true
                firstWrapperGpd.style.border = "3px solid #FD4C4C"

                medalsBigWrapper.classList.add("activeSeason")
                pibBigWrapper.classList.remove("activeSeason")

                firstWrapperGpdSpan.style.backgroundColor = "#FBB4B4"
                secondWrapperGpdSpan.style.backgroundColor = "#FD9B9B"
                thirdWrapperGpdSpan.style.backgroundColor = "#FF7777"

                pibBigWrapper.classList.remove('active')
                medalsBigWrapper.classList.add('active')

                inputWrapper.max = 2020
                inputWrapper.value = 1988
                setDate(slider, realDate)
                medalsCountries().then()

            } else {

                resetMap()

                firstWrapperGpd.classList.add('active')
                firstWrapperMedalsVerification = true
                firstWrapperGpd.style.border = "3px solid #9EC3FF"

                medalsBigWrapper.classList.remove("activeSeason")
                pibBigWrapper.classList.add("activeSeason")

                firstWrapperGpdSpan.style.backgroundColor = "#B4D6FF"
                secondWrapperGpdSpan.style.backgroundColor = "#9DC2FF"
                thirdWrapperGpdSpan.style.backgroundColor = "#7C9FFF"

                pibBigWrapper.classList.add('active')
                medalsBigWrapper.classList.remove('active')

                inputWrapper.max = 2018
                inputWrapper.value = 1990
                setDate(slider, realDate)
                medalsCountries().then()

            }

        }

    }

    medalsBigWrapper.onclick = () => {

        if (!seasonsWrapperVerif) {

            if (medalsBigWrapper.classList.contains('active')) {
                medalsBigWrapper.classList.remove('active')
                firstWrapperMedals.classList.remove('active')
                secondWrapperMedals.classList.remove('active')
                thirdWrapperMedals.classList.remove('active')
                firstWrapperMedalsVerification = firstWrapperMedals.classList.contains('active')
                secondWrapperMedalsVerification = firstWrapperMedals.classList.contains('active')
                thirdWrapperMedalsVerification = firstWrapperMedals.classList.contains('active')
                firstWrapperMedals.style.border = "3px solid transparent"
                secondWrapperMedals.style.border = "3px solid transparent"
                thirdWrapperMedals.style.border = "3px solid transparent"
            } else {
                firstWrapperMedals.classList.toggle('active')
                firstWrapperMedalsVerification = firstWrapperMedals.classList.contains('active')
                firstWrapperMedals.style.border = "3px solid #FD4C4C"
                switchPibMedals()
            }

            medalsCountries().then()


        } else {

            if (medalsBigWrapper.classList.contains('active')) {

                resetMap()

                firstWrapperGpd.classList.add('active')
                firstWrapperMedalsVerification = firstWrapperGpd.classList.contains('active')
                firstWrapperGpd.style.border = "3px solid #9EC3FF"

                medalsBigWrapper.classList.remove("activeSeason")
                pibBigWrapper.classList.add("activeSeason")

                firstWrapperGpdSpan.style.backgroundColor = "#B4D6FF"
                secondWrapperGpdSpan.style.backgroundColor = "#9DC2FF"
                thirdWrapperGpdSpan.style.backgroundColor = "#7C9FFF"

                medalsBigWrapper.classList.remove('active')
                pibBigWrapper.classList.add('active')

                inputWrapper.max = 2018
                inputWrapper.value = 1990
                setDate(slider, realDate)
                medalsCountries().then()

            } else {

                resetMap()

                firstWrapperGpd.classList.add('active')
                firstWrapperMedalsVerification = firstWrapperGpd.classList.contains('active')
                firstWrapperGpd.style.border = "3px solid #FD4C4C"

                firstWrapperGpdSpan.style.backgroundColor = "#FBB4B4"
                secondWrapperGpdSpan.style.backgroundColor = "#FD9B9B"
                thirdWrapperGpdSpan.style.backgroundColor = "#FF7777"

                medalsBigWrapper.classList.add("activeSeason")
                pibBigWrapper.classList.remove("activeSeason")

                pibBigWrapper.classList.remove('active')
                medalsBigWrapper.classList.add('active')

                inputWrapper.max = 2020
                inputWrapper.value = 1988
                setDate(slider, realDate)
                medalsCountries().then()

            }

        }


    }

    startMap()

    ///////////////////////////////////////////// COUNTRIES PIB //////////////////////////////////////////////////////

    map.addLayer({
        'id': 'countriesPib',
        'type': 'fill',
        'source': 'countries',
        'paint': {
            'fill-color': [
                "case",
                ["==", ["feature-state", "colorCountries"], 0], "#EAEAEA",
                ["==", ["feature-state", "colorCountries"], 1], "#B4D6FF",
                ["==", ["feature-state", "colorCountries"], 2], "#9DC2FF",
                ["==", ["feature-state", "colorCountries"], 3], "#7C9FFF",
                "#EAEAEA"
            ],
            'fill-opacity': 1
        }
    });

    async function pibCountries() {
        // Get the data
        let data = await axios.get(process.env.VPS + '/gpd-by-population?year=' + slider.value)

        let countriesGpd
        let color = 0

        for (let i = 0; i < data.data.length; i++) {

            let indexOfFeatures = src.map(function (e) {
                return e.properties.ISO_A3;
            }).indexOf(data.data[i].country);

            countriesGpd = data.data[i].gpdByPopulation

            if (countriesGpd >= 0 && countriesGpd < 2500) {

                if (firstWrapperGpdVerification) {

                    color = 1
                }

            } else if (countriesGpd >= 2500 && countriesGpd < 15000) {

                if (secondWrapperGpdVerification) {

                    color = 2
                }

            } else {

                if (thirdWrapperGpdVerification) {

                    color = 3
                }

            }

            map.setFeatureState(
                {
                    source: 'countries',
                    id: indexOfFeatures
                },
                {colorCountries: color},
            );

            color = null

        }

    }

    if (firstWrapperGpdVerification || secondWrapperGpdVerification || thirdWrapperGpdVerification) {
        pibCountries().then()
    }

    ///////////////////////////////////////////// COUNTRIES MEDALS FILL /////////////////////////////////////////////////////

    map.addLayer({
        'id': 'countriesMedals',
        'type': 'fill',
        'source': 'countries',
        'paint': {
            'fill-color': [
                "case",
                ["==", ["feature-state", "colorMedals"], 0], "#EAEAEA",
                ["==", ["feature-state", "colorMedals"], 1], "#FBB4B4",
                ["==", ["feature-state", "colorMedals"], 2], "#FD9B9B",
                ["==", ["feature-state", "colorMedals"], 3], "#FF7777",
                ["==", ["feature-state", "colorMedals"], 4], "#c6e6ff",
                ["==", ["feature-state", "colorMedals"], 5], "#60aafc",
                ["==", ["feature-state", "colorMedals"], 6], "#0048ff",
                "#EAEAEA"
            ],
            'fill-opacity': 1
        }
    });

    async function medalsCountries() {
        // Get the data
        let data = await axios.get(process.env.VPS + '/medals?year=' + slider.value)

        let dataArray = []

        for (let i = 0; i < data.data.length; i++) {
            dataArray.push(data.data[i].country)
        }

        let srcCapitalsArray = []
        for (let i = 0; i < srcCapitals.length; i++) {
            srcCapitalsArray.push(getCountryISO3(srcCapitals[i].properties.ISO))
        }

        let countriesMedals
        let colorMedals = 0
        let circleRadius = 0

        for (let i = 0; i < src.length; i++) {

            let indexOfFeature = dataArray.findIndex(index => index === src[i].properties.ISO_A3)

            let indexOfFeatureCapitals = srcCapitalsArray.findIndex(index => index === src[i].properties.ISO_A3)

            if (indexOfFeature === -1) {

                countriesMedals = 0
                circleRadius = 0

            } else {

                countriesMedals = data.data[indexOfFeature].total

            }

            if (!firstWrapperMedalsVerification && !secondWrapperMedalsVerification && !thirdWrapperMedalsVerification) {

                colorMedals = 0
                circleRadius = 0

            } else {

                if (countriesMedals > 0 && countriesMedals < 50) {

                    if (firstWrapperMedalsVerification) {

                        if (seasonsWrapperVerif) {

                            if (medalsBigWrapper.classList.contains('active')) {

                                colorMedals = 1
                                circleRadius = 1

                            } else {

                                colorMedals = 4

                            }

                        } else {

                            colorMedals = 1
                            circleRadius = 1
                        }

                    }

                } else if (countriesMedals >= 50 && countriesMedals < 100) {

                    if (secondWrapperMedalsVerification) {

                        if (seasonsWrapperVerif) {

                            if (medalsBigWrapper.classList.contains('active')) {

                                colorMedals = 2
                                circleRadius = 2

                            } else {

                                colorMedals = 5

                            }

                        } else {

                            colorMedals = 2
                            circleRadius = 2
                        }

                    }

                } else if (countriesMedals >= 100) {

                    if (thirdWrapperMedalsVerification) {

                        if (seasonsWrapperVerif) {

                            if (medalsBigWrapper.classList.contains('active')) {

                                colorMedals = 3
                                circleRadius = 3

                            } else {

                                colorMedals = 6

                            }

                        } else {

                            colorMedals = 3
                            circleRadius = 3
                        }

                    }

                } else {

                    colorMedals = 0
                    circleRadius = 0

                }

            }

            if (seasonsWrapperVerif) {
                circleRadius = 0
            } else {
                colorMedals = 0
            }

            map.setFeatureState(
                {
                    source: 'countries',
                    id: i
                },
                {colorMedals: colorMedals},
            );

            map.setFeatureState(
                {
                    source: 'capitals',
                    id: indexOfFeatureCapitals
                },
                {circleRadius: circleRadius},
            );

            colorMedals = null

        }

    }

    if (firstWrapperMedalsVerification || secondWrapperMedalsVerification || thirdWrapperMedalsVerification) {
        medalsCountries().then()
    }

    map.setPaintProperty(
        'countriesMedals',
        'fill-opacity',
        0,
    )

    ///////////////////////////////////////////// COUNTRIES MEDALS CIRCLE //////////////////////////////////////////////

    map.addLayer({
        'id': 'countriesMedalsCircle',
        'type': 'circle',
        'source': 'capitals',
        'paint': {
            'circle-radius': [
                "case",
                ["==", ["feature-state", "circleRadius"], 0], 0,
                ["==", ["feature-state", "circleRadius"], 1], 10,
                ["==", ["feature-state", "circleRadius"], 2], 20,
                ["==", ["feature-state", "circleRadius"], 3], 30,
                0
            ],
            'circle-opacity': 0.65,
            'circle-color': [
                "case",
                ["==", ["feature-state", "circleRadius"], 0], "#EAEAEA",
                ["==", ["feature-state", "circleRadius"], 1], "#F36B79",
                ["==", ["feature-state", "circleRadius"], 2], "#F36B79",
                ["==", ["feature-state", "circleRadius"], 3], "#F36B79",
                "#EAEAEA"
            ],
            "circle-stroke-width": [
                "case",
                ["==", ["feature-state", "circleRadius"], 0], 0,
                ["==", ["feature-state", "circleRadius"], 1], 2,
                ["==", ["feature-state", "circleRadius"], 2], 2,
                ["==", ["feature-state", "circleRadius"], 3], 2,
                0
            ],
            "circle-stroke-color": "#FE414D"
        }
    });

    ///////////////////////////////////////////////// COUNTRY //////////////////////////////////////////////////////////

    let countryRealName

    map.on('click', 'countriesHover', (e) => {
        countryRealName = Object.values(e.features[0].properties)[1]

        let bbox = turf.extent(e.features[0])

        function center() {

            if (mapInfoWrapper.classList.contains('active')) {
                map.fitBounds(bbox, {
                    padding: {top: 100, bottom: 100, left: 0, right: 0},
                    maxZoom: 3,
                    linear: true,
                    duration: 1000,
                    pitch: 0
                })
            } else {
                map.fitBounds(bbox, {
                    padding: {top: 100, bottom: 100, left: 600, right: 0},
                    maxZoom: 3,
                    linear: true,
                    duration: 1000,
                    pitch: 0
                })
            }

        }

        center()

        async function getInfoOfCountries() {

            let countryName = e.features[0].properties.ADMIN
            let countryIso = e.features[0].properties.ISO_A3

            if (countryIso !== "-99") {

                const dataMedals = await axios.get(process.env.VPS + '/medals?year=' + slider.value)
                const dataPib = await axios.get(process.env.VPS + '/gpd-by-population/?year=' + slider.value)

                let dataMedalsArray = []
                let dataPibArray = []

                for (let i = 0; i < dataMedals.data.length; i++) {
                    dataMedalsArray.push(dataMedals.data[i].country)
                }

                for (let i = 0; i < dataPib.data.length; i++) {
                    dataPibArray.push(dataPib.data[i].country)
                }

                let indexOfMedals = dataMedalsArray.findIndex(index => index === countryIso)
                let indexOfPib = dataPibArray.findIndex(index => index === countryIso)

                let countryMedals
                let countryPib

                if (indexOfMedals !== -1) {
                    countryMedals = dataMedals.data[indexOfMedals].total
                } else {
                    countryMedals = 0
                }

                if (indexOfPib !== -1) {
                    countryPib = dataPib.data[indexOfPib].gpdByPopulation
                } else {
                    countryPib = 0
                }

                console.log(countryName, countryMedals, countryPib)

                const firstPartCountry = document.querySelector('.popUp .first-part .country')

            } else {
                console.log("no iso")
            }

        }

        getInfoOfCountries().then()

    });

    // Border
    map.addLayer({
        'id': 'countries',
        'type': 'line',
        'source': 'countries',
        'layout': {},
        'paint': {
            'line-color': '#F9FBFE',
            'line-width': 1,
            'line-opacity': 0.3
        }
    });

});