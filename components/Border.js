import { useEffect } from 'react';
import { useGoogleMap } from '@react-google-maps/api';
import { getGeoJSON } from '@/utils/map-helpers';

const countryHighlightStyle = {
    fillColor: '#90EE90',
    fillOpacity: .5,
    strokeWeight: .25,
}
export default function Border({ country }) {
    const mapObj = useGoogleMap();

    useEffect(() => {
        if (!mapObj) return;

        (async () => {
            const data = await getGeoJSON(country);
            mapObj.data.addGeoJson(data.geojson);
            mapObj.data.setStyle(countryHighlightStyle);
        })();
    }, [country, mapObj]);

    return null;
}
