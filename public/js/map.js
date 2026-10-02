    mapboxgl.accessToken= mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/standard',
    pitch: 74,
    bearing: 12.8,
    hash: true,
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});

map.on('style.load', () => {
    map.setConfigProperty('basemap', 'lightPreset', 'dusk');

    // use an expression to transition some properties between zoom levels 11 and 13, preventing visibility when zoomed out
    const zoomBasedReveal = (value) => {
        return [
            'interpolate',
            ['linear'],
            ['zoom'],
            11,
            0.0,
            15,
            value
        ];
    };


    map.setSnow({
        density: zoomBasedReveal(0.85),
        intensity: 1.0,
        'center-thinning': 0.1,
        direction: [0, 50],
        opacity: 1.0,
        color: `#ffffff`,
        'flake-size': 0.71,
        vignette: zoomBasedReveal(0.3),
        'vignette-color': `#ffffff`
    });
});


const marker = new mapboxgl.Marker({ color: 'reddish' })
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`${newlocation}`))
    .addTo(map);

