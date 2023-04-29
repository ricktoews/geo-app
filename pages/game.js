import { useEffect, useState } from 'react';
import ImageGrid from '../components/ImageGrid';
import { getGeoPath } from '../utils/get-path';

import countries from '../data/countries.json';


export default function Game(props) {
    const [origCountry, setOrigCountry] = useState('');
    const [destCountry, setDestCountry] = useState('');
    const [countryPool, setCountryPool] = useState([]);
    const [filenames, setFilenames] = useState([]);
    const [geoPath, setGeoPath] = useState();

    useEffect(() => {
        const pool = countries.filter(country => country.continent === 'Europe');
        setCountryPool(pool);
        setFilenames(pool.map(item => item.country));
        const countryCount = pool.length;
        const origNdx = Math.floor(Math.random() * countryCount);
        const destNdx = Math.floor(Math.random() * countryCount);
        const randOrigin = pool[origNdx].country;
        const randDest = pool[destNdx].country;
        setOrigCountry(randOrigin);
        setDestCountry(randDest);
    }, []);

    useEffect(() => {
        console.log(`====> origin ${origCountry}, dest ${destCountry}`);
        const result = getGeoPath(origCountry, destCountry);
        setGeoPath(result.path);
        console.log('====> Path', geoPath);
    }, [origCountry, destCountry])

    function makeFileName(str) {
        str = str.replaceAll(' ', '-');
        const filename = '/images/shapes/' + str.toLowerCase() + '.png';
        return filename;
    }

    function setNewOrigin(origin) {
        setOrigCountry(origin);
    }

    return !origCountry || !destCountry ? null : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
            <div className="flex justify-between">
                <div className="w-1/2 flex items-center justify-center">
                    Origin: {origCountry}<br />
                    <img src={makeFileName(origCountry)} alt={origCountry} className="mx-auto max-w-full w-48" />
                </div>
                <div className="w-1/2 flex items-center justify-center">
                    Destination: {destCountry}<br />
                    <img src={makeFileName(destCountry)} alt={destCountry} className="mx-auto max-w-full w-48" />
                </div>
            </div>

            <ImageGrid filenames={filenames} setNewOrigin={setNewOrigin} />
        </div>
    )
}