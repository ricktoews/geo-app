import { useEffect, useState } from 'react';
import ImageGrid from '../components/ImageGrid';
import { getGeoPath } from '../utils/get-path';

import countries from '../data/borders.json';


export default function Game(props) {
    const [origCountry, setOrigCountry] = useState('');
    const [destCountry, setDestCountry] = useState('');
    const [currentBorders, setCurrentBorders] = useState([]);
    const [countryPool, setCountryPool] = useState([]);
    const [filenames, setFilenames] = useState([]);
    const [geoPath, setGeoPath] = useState();
    const [myPath, setMyPath] = useState([]);
    const [arrived, setArrived] = useState(false);

    function start() {
        setArrived(false);
        setMyPath([]);
        const pool = countries.filter(country => country.continent === 'Europe' && country.borders.length > 0 && !country.nopath);
        setCountryPool(countries);
        setFilenames(pool.map(item => item.country));
        const countryCount = pool.length;
        const origNdx = Math.floor(Math.random() * countryCount);
        const destNdx = Math.floor(Math.random() * countryCount);
        const randOrigin = pool[origNdx].country;
        const randDest = pool[destNdx].country;
        setOrigCountry(randOrigin);
        setDestCountry(randDest);
        setCurrentBorders(pool[origNdx].borders);

    }

    useEffect(() => {
        start();
    }, []);

    useEffect(() => {
        if (origCountry.length > 0 && destCountry.length > 0) {
            console.log(`====> origin ${origCountry}, dest ${destCountry}`);
            console.log('====> origin borders', currentBorders);
            const result = getGeoPath(origCountry, destCountry);
            setGeoPath(result.path);
            const _path = JSON.parse(JSON.stringify(myPath));
            _path.push(origCountry);
            setMyPath(_path);
            console.log('====> Path', result.path);
        }
    }, [destCountry])

    function handleOriginClick(e) {
        console.log('====> current borders', currentBorders);
        console.log('====> filenames', filenames);
        setFilenames(currentBorders);
    }

    function getCountryObject(country) {
        const countryObj = countryPool.find(obj => obj.country === country);
        if (!countryObj) return {};
        return countryObj;
    }

    function makeFileName(str) {
        str = str.replaceAll(' ', '-');
        const filename = '/images/flags/' + str.toLowerCase() + '.png';
        return filename;
    }

    function setNewOrigin(countryName) {
        const _path = JSON.parse(JSON.stringify(myPath));
        _path.push(countryName);
        setMyPath(_path);

        if (countryName === destCountry) {
            console.log('====> YOU MADE IT!!');
            setArrived(true);
        }
        const countryObj = getCountryObject(countryName);
        setOrigCountry(countryName);
        setCurrentBorders(countryObj.borders);
    }

    return !origCountry || !destCountry ? null : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
            <div className="flex justify-between">
                <div onClick={handleOriginClick} className="w-1/2 flex flex-col items-center justify-center">
                    <div>Origin: {origCountry}</div>
                    <div><img src={makeFileName(origCountry)} alt={origCountry} className="mx-auto max-h-20" /></div>
                </div>
                <div className="w-1/2 flex flex-col items-center justify-center">
                    <div>Destination: {destCountry}</div>
                    <div><img src={makeFileName(destCountry)} alt={destCountry} className="mx-auto max-h-20" /></div>
                </div>
            </div>
            <hr className="my-5" />

            {arrived && (<div>
                <div>YOU HAVE ARRIVED!</div>
                <div>Your path: {myPath.join(', ')} (Steps: {myPath.length})</div>
                <div>Shortest path: {geoPath.join(', ')} (Steps: {geoPath.length})</div>
                <hr className="my-5" />
                <div><button onClick={start}>Again!</button></div>
            </div>)}

            {!arrived && <ImageGrid filenames={currentBorders} setNewOrigin={setNewOrigin} />}
        </div>
    )
}