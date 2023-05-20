import { useEffect } from 'react';
import { useGoogleMap } from '@react-google-maps/api';
import { adjustZoom, getGeoJSON } from '@/utils/map-helpers';
import { DEFAULT_ZOOM } from '@/utils/constants';
import CountrySizes from '@/data/country-sizes.json';
console.log(CountrySizes);
const countryHighlightStyle = {
    fillColor: 'purple',
    fillOpacity: .5,
    strokeWeight: .25,
}
export default function Border({ country, countryObject }) {
    const mapObj = useGoogleMap();

    useEffect(() => {
        if (!mapObj) return;

        (async () => {
            const data = await getGeoJSON(country);
            const zoom = adjustZoom(country, CountrySizes[country]);
            console.log('====> Zoom set to', zoom);
            if (zoom !== DEFAULT_ZOOM) {
                console.log('====> zooming to', zoom, 'instead of', DEFAULT_ZOOM);
            }
            mapObj.setZoom(zoom);
            // forEach / remove approach to remove previous geojson data offered by ChatGPT.
            mapObj.data.forEach(feature => {
                mapObj.data.remove(feature);
            });
            mapObj.data.addGeoJson(data.geojson);
            mapObj.data.setStyle(countryHighlightStyle);
        })();
    }, [country, mapObj]);

    return null;
}
