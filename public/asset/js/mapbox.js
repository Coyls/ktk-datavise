import countries from '../json/countries.json'
import axios from "axios"

mapboxgl.accessToken = 'pk.eyJ1Ijoibm9vb29vb29vb29vb29vb2UiLCJhIjoiY2t2aTN0OXFtMGZvYzJvbjBlYmNhcnJlbiJ9.7d0EuZjxcvKMFEuyVoEAnw'

const maxCoordinates = [[-169.7827071443, -58.7187007344], [-170.8033889302, 77.5153340433], [178.6670204285, 77.895585424], [179.6877022144, -57.778978041], [-169.7827071443, -58.7187007344]];

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/noooooooooooooooe/ckvi4aw5d1jsb14oak88v6scz", // style URL
    center: [3.5, 45], // starting position [lng, lat]
    zoom: 4,
    maxZoom: 5.5,
    minZoom: 1.5,
    pitch: 0,
    //maxBounds: maxCoordinates, // max coordinates
});

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

    // Get the source
    const src = map.getSource('countries')._data.features

    // Border
    map.addLayer({
        'id': 'countries',
        'type': 'line',
        'source': 'countries',
        'layout': {},
        'paint': {
            'line-color': '#F9FBFE',
            'line-width': 1
        }
    });

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

        firstWrapperMedals.classList.remove('active')
        secondWrapperMedals.classList.remove('active')
        thirdWrapperMedals.classList.remove('active')
        firstWrapperGpd.classList.remove('active')
        secondWrapperGpd.classList.remove('active')
        thirdWrapperGpd.classList.remove('active')

        pibBigWrapper.classList.remove('active')
        medalsBigWrapper.classList.remove('active')

        medalsCountries().then()
        pibCountries().then()
    }

    function startMap() {

        firstWrapperGpd.classList.add('active')
        firstWrapperGpdVerification = firstWrapperGpd.classList.contains('active')
        firstWrapperGpd.style.border = "3px solid #9EC3FF"
        pibBigWrapper.classList.add('active')
        medalsCountries().then()
        switchPibMedals()

    }


    ///////////////////////////////////////////// INTERACTION MAP //////////////////////////////////////////////////////

    const firstWrapperGpd = document.querySelector('#map .wrapper .map-info-wrapper .info-wrapper .pib-global-wrapper .first-wrapper')
    const secondWrapperGpd = document.querySelector('#map .wrapper .map-info-wrapper .info-wrapper .pib-global-wrapper .second-wrapper')
    const thirdWrapperGpd = document.querySelector('#map .wrapper .map-info-wrapper .info-wrapper .pib-global-wrapper .third-wrapper')

    const firstWrapperGpdSpan = document.querySelector('#map .wrapper .map-info-wrapper .info-wrapper .pib-global-wrapper .first-wrapper .first-span')
    const secondWrapperGpdSpan = document.querySelector('#map .wrapper .map-info-wrapper .info-wrapper .pib-global-wrapper .first-wrapper .second-span')
    const thirdWrapperGpdSpan = document.querySelector('#map .wrapper .map-info-wrapper .info-wrapper .pib-global-wrapper .first-wrapper .third-span')

    let firstWrapperGpdVerification = false
    let secondWrapperGpdVerification = false
    let thirdWrapperGpdVerification = false

    firstWrapperGpd.onclick = () => {

        if (!seasonsWrapperVerif) {

            firstWrapperGpd.classList.toggle('active')
            firstWrapperGpdVerification = firstWrapperGpd.classList.contains('active')

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

            switchPibMedals()
            medalsCountries().then()

        }

    }

    secondWrapperGpd.onclick = () => {

        if (!seasonsWrapperVerif) {

            secondWrapperGpd.classList.toggle('active')
            secondWrapperGpdVerification = secondWrapperGpd.classList.contains('active')

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
            switchPibMedals()

        }

    }

    thirdWrapperGpd.onclick = () => {

        if (!seasonsWrapperVerif) {

            thirdWrapperGpd.classList.toggle('active')
            thirdWrapperGpdVerification = thirdWrapperGpd.classList.contains('active');

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
            switchPibMedals()

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
        medalsCountries().then()
        switchPibMedals()

        if (firstWrapperMedalsVerification) {
            firstWrapperMedals.style.border = "3px solid #FD4C4C"
        } else {
            firstWrapperMedals.style.border = "3px solid transparent"
        }

    }

    secondWrapperMedals.onclick = () => {

        secondWrapperMedals.classList.toggle('active')
        secondWrapperMedalsVerification = secondWrapperMedals.classList.contains('active');
        medalsCountries().then()
        switchPibMedals()

        if (secondWrapperMedalsVerification) {
            secondWrapperMedals.style.border = "3px solid #FD4C4C"
        } else {
            secondWrapperMedals.style.border = "3px solid transparent"
        }

    }

    thirdWrapperMedals.onclick = () => {

        thirdWrapperMedals.classList.toggle('active')
        thirdWrapperMedalsVerification = thirdWrapperMedals.classList.contains('active');
        medalsCountries().then()
        switchPibMedals()

        if (thirdWrapperMedalsVerification) {
            thirdWrapperMedals.style.border = "3px solid #FD4C4C"
        } else {
            thirdWrapperMedals.style.border = "3px solid transparent"
        }

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
    const seasonsWrapperImage = document.querySelector('.seasons-wrapper img')

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

        } else {
            resetMap()
            startMap()
            seasonsWrapperParagraph.innerHTML = 'Carte des saisons'
            pibBigWrapperParagraph.innerHTML = 'PIB'
            medalsBigWrapperParagraph.innerHTML = 'MÉDAILLÉS'
            pibLegendWrapperParagraph.innerHTML = 'PIB par habitants en millions de dollars'
            medalsLegendWrapper.style.display = 'block'

            map.setPaintProperty(
                'countriesPib',
                'fill-opacity',
                0.75,
            )
        }

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
                firstWrapperGpd.style.border = "3px solid #7C9FFF"
                switchPibMedals()
            }

            pibCountries().then()

        } else {

            if (pibBigWrapper.classList.contains('active')) {

                resetMap()

                firstWrapperGpd.classList.add('active')
                firstWrapperGpdVerification = true
                firstWrapperGpd.style.border = "3px solid #FD4C4C"

                pibBigWrapper.classList.remove('active')
                medalsBigWrapper.classList.add('active')

                inputWrapper.value = 1988
                setDate(slider, realDate)
                medalsCountries().then()

            } else {

                resetMap()

                firstWrapperGpd.classList.add('active')
                firstWrapperGpdVerification = true
                firstWrapperGpd.style.border = "3px solid #7C9FFF"

                pibBigWrapper.classList.add('active')
                medalsBigWrapper.classList.remove('active')

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
                firstWrapperMedalsVerification = true
                firstWrapperGpd.style.border = "3px solid #7C9FFF"

                medalsBigWrapper.classList.remove('active')
                pibBigWrapper.classList.add('active')

                inputWrapper.value = 1990
                setDate(slider, realDate)
                medalsCountries().then()

            } else {

                resetMap()

                firstWrapperGpd.classList.add('active')
                firstWrapperGpdVerification = firstWrapperGpd.classList.contains('active')
                firstWrapperGpd.style.border = "3px solid #FD4C4C"

                medalsBigWrapper.classList.add('active')
                pibBigWrapper.classList.remove('active')

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
                ["==", ["feature-state", "colorCountries"], 0], "#d0d0d0",
                ["==", ["feature-state", "colorCountries"], 1], "#B4D6FF",
                ["==", ["feature-state", "colorCountries"], 2], "#9DC2FF",
                ["==", ["feature-state", "colorCountries"], 3], "#7C9FFF",
                "#d0d0d0"
            ],
            'fill-opacity': 0.75
        }
    });

    async function pibCountries() {
        // Get the data
        let data = await axios.get(process.env.VPS + '/gpds?year=' + slider.value)
        let finalData = data.data.sort(function (a, b) {
            if (a.country < b.country) {
                return -1;
            }
            if (a.country > b.country) {
                return 1;
            }
            return 0;
        })

        let countriesGpd
        let color = 0

        for (let i = 0; i < finalData.length; i++) {

            let indexOfFeatures = src.map(function (e) {
                return e.properties.ISO_A3;
            }).indexOf(finalData[i].country);

            countriesGpd = finalData[i].gpd

            if (countriesGpd >= 0 && countriesGpd < 5000000000) {

                if (firstWrapperGpdVerification) {

                    color = 1
                }

            } else if (countriesGpd >= 5000000000 && countriesGpd < 20000000000) {

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

    ///////////////////////////////////////////// COUNTRIES MEDALS /////////////////////////////////////////////////////

    map.addLayer({
        'id': 'countriesMedals',
        'type': 'fill',
        'source': 'countries',
        'paint': {
            'fill-color': [
                "case",
                ["==", ["feature-state", "circleRadius"], 0], "#d0d0d0",
                ["==", ["feature-state", "circleRadius"], 1], "#ffafa8",
                ["==", ["feature-state", "circleRadius"], 2], "#ff5753",
                ["==", ["feature-state", "circleRadius"], 3], "#ff0a00",
                "#d0d0d0"
            ],
            'fill-opacity': 0.75
        }
    });

    async function medalsCountries() {
        // Get the data
        let data = await axios.get(process.env.VPS + '/medals?year=' + slider.value)
        let finalData = data.data.sort(function (a, b) {
            if (a.country < b.country) {
                return -1;
            }
            if (a.country > b.country) {
                return 1;
            }
            return 0;
        })

        let countriesMedals
        let circleRadius = 0

        for (let i = 0; i < finalData.length; i++) {

            let indexOfFeatures = src.map(function (e) {
                return e.properties.ISO_A3;
            }).indexOf(finalData[i].country);

            //let bbox = turf.extent(src[i])
            //console.log("Bbox of " + src[indexOfFeatures].properties.ISO_A3 + " is " + bbox)


            countriesMedals = finalData[i].total

            if (countriesMedals < 30) {

                if (firstWrapperMedalsVerification) {

                    circleRadius = 1

                }

            } else if (countriesMedals >= 30 && countriesMedals < 100) {

                if (secondWrapperMedalsVerification) {

                    circleRadius = 2

                }

            } else {

                if (thirdWrapperMedalsVerification) {

                    circleRadius = 3

                }

            }

            // console.log(finalData[i].country + " has " + countriesMedals + " medals, so the circle-radius is " + circleRadius)

            map.setFeatureState(
                {
                    source: 'countries',
                    id: indexOfFeatures
                },
                {circleRadius: circleRadius},
            );

            circleRadius = 0

        }

    }

    if (firstWrapperMedalsVerification || secondWrapperMedalsVerification || thirdWrapperMedalsVerification) {
        medalsCountries().then()
    }

    ///////////////////////////////////////////////// COUNTRY //////////////////////////////////////////////////////////

    let countryRealName

    map.on('click', 'countriesHover', (e) => {
        countryRealName = Object.values(e.features[0].properties)[1]
        console.log(e.features[0])

        console.log("country = " + countryRealName)

        let bbox = turf.extent(e.features[0])

        function center() {
            map.fitBounds(bbox, {
                padding: {top: 100, bottom: 100, left: 650, right: 0},
                maxZoom: 3,
                linear: true,
                duration: 1000
            })
        }

        center()

    });

    /*
    if (!seasonsWrapperVerif) {

        if (medalsBigWrapper.classList.contains('active') && !pibBigWrapper.classList.contains('active')) {
            map.setPaintProperty(
                'countriesPib',
                'fill-opacity',
                0,
            )
            map.setPaintProperty(
                'countriesMedals',
                'fill-opacity',
                1,
            )
        }


        if (!medalsBigWrapper.classList.contains('active') && pibBigWrapper.classList.contains('active')) {
            map.setPaintProperty(
                'countriesPib',
                'fill-opacity',
                1,
            )
            map.setPaintProperty(
                'countriesMedals',
                'fill-opacity',
                0,
            )
        }


        if (!medalsBigWrapper.classList.contains('active') && !pibBigWrapper.classList.contains('active')) {

            map.setPaintProperty(
                'countriesPib',
                'fill-opacity',
                1,
            )

            map.setPaintProperty(
                'countriesMedals',
                'fill-opacity',
                1,
            )
        }

    }

     */


    // Mouse position
    /*map.on('mousemove', (e) => {
        // `e.point` is the x, y coordinates of the `mousemove` event
        // relative to the top-left corner of the map.
        // `e.lngLat` is the longitude, latitude geographical position of the event.
         console.log(JSON.stringify(e.point) + " " + e.lngLat.wrap())
    });*/


    // Add marker on mouse position on click
    /*map.on('click', function(e) {
        let lat = e.lngLat.wrap().lat;
        let lng = e.lngLat.wrap().lng;

        const marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map)

    });*/

    // Add popup on mouse position on click
    /*map.on('click', function(e) {
        let lat = e.lngLat.wrap().lat;
        let lng = e.lngLat.wrap().lng;

        const popup = new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat([lng, lat])
            .setHTML('<h1>hello world</h1>')
            .addTo(map);
    });*/


    // Markers
    /*const markerParis = new mapboxgl.Marker()
        .setLngLat([2.3522219, 48.856614])
        .addTo(map)*/
});