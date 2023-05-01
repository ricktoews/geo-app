import { useEffect, useRef, useState } from 'react';
import ImageGrid from '@/components/ImageGrid';
import ContinentSelector from '@/components/ContinentSelector';
import { getGeoPath } from '../utils/get-path';

import countries from '../data/borders.json';


export default function Game(props) {
    const [poolContinents, setPoolContinents] = useState([]);
    const [origCountry, setOrigCountry] = useState('');
    const [destCountry, setDestCountry] = useState('');
    const [challengeCountry, setChallengeCountry] = useState({});
    const [currentBorders, setCurrentBorders] = useState([]);
    const [countryPool, setCountryPool] = useState([]);
    const [filenames, setFilenames] = useState([]);
    const [geoPath, setGeoPath] = useState();
    const [myPath, setMyPath] = useState([]);
    const [arrived, setArrived] = useState(false);

    const challengeInput = useRef(null);

    function selectPoolForContinents(continents) {
        console.log('====> continents', continents);
        const pool = countries.filter(country => {
            if (country.borders.length === 0) return false;

            if (country.nopath) return false;

            let result = false;
            continents.forEach(continent => {
                if (country.continent.toLowerCase().indexOf(continent) !== -1) {
                    result = true;
                }
            })
            return result;
        });

        return pool;
    }

    function start() {
        console.log('====> Start, poolContinents', poolContinents);
        setArrived(false);
        setMyPath([]);
        setCountryPool(countries);

        const pool = selectPoolForContinents(poolContinents);
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
        setPoolContinents(['europe']);

    }, []);

    useEffect(() => {
        console.log('====> set new continent selection; poolContinents:', poolContinents);
        if (poolContinents.length > 0) {
            start();
        }

    }, [poolContinents]);

    useEffect(() => {
        if (origCountry.length > 0 && destCountry.length > 0) {
            const result = getGeoPath(origCountry, destCountry);
            setGeoPath(result.path);
            const _path = JSON.parse(JSON.stringify(myPath));
            _path.push(origCountry);
            setMyPath(_path);
        }
    }, [destCountry])

    useEffect(() => {
        console.log('====> challengeCountry changed; input', challengeInput);
        if (challengeInput.current) {
            console.log('====> Country challenge field should be focused.');
            challengeInput.current.focus();
        }
    }, [challengeCountry])

    function handleOriginClick(e) {
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

    function setContinentSelection(selection) {
        const continents = Object.keys(selection).filter(key => selection[key]).map(item => item.replaceAll('-', ' '));

        setPoolContinents(continents);
    }

    function setNewOrigin(countryName) {
        const _path = JSON.parse(JSON.stringify(myPath));
        _path.push(countryName);
        setMyPath(_path);

        if (countryName === destCountry) {
            setArrived(true);
        }
        const countryObj = getCountryObject(countryName);
        setOrigCountry(countryName);
        setCurrentBorders(countryObj.borders);
        setChallengeCountry({});
    }

    function countryChallenge(countryName) {
        const countryObj = getCountryObject(countryName);
        setChallengeCountry(countryObj);
    }

    function handleChallenge(event) {
        const el = event.target;
        const value = el.value;
        console.log('====> handleChallenge', value, challengeCountry.capital);
        if (value === challengeCountry.capital) {
            setNewOrigin(challengeCountry.country);
        }
    }

    return !origCountry || !destCountry ? null : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
            <ContinentSelector continents={poolContinents} setContinentSelection={setContinentSelection} />

            {
                poolContinents.length > 0 && (<>
                    <div className="flex justify-between">
                        <div onClick={handleOriginClick} className="relative w-1/2 flex flex-col items-center justify-center">
                            <div id="origin-label" className="absolute bottom-0 text-center bg-gray-500 bg-opacity-50 text-white px-1 py-1">{origCountry}</div>
                            <div><img src={makeFileName(origCountry)} alt={origCountry} className="mx-auto max-h-20 object-contain" /></div>
                        </div>
                        <div className="relative w-1/2 flex flex-col items-center justify-center">
                            <div id="dest-label" className="absolute bottom-0 text-center bg-gray-500 bg-opacity-50 text-white px-1 py-1">{destCountry}</div>
                            <div><img src={makeFileName(destCountry)} alt={destCountry} className="mx-auto max-h-20 object-contain" /></div>
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

                    {!arrived && (<>
                        <ImageGrid filenames={currentBorders} setNewOrigin={countryChallenge} />
                        {challengeCountry.capital && (
                            <div>
                                <div>Challenge: What&apos;s the capital of {challengeCountry.country}?</div>
                                <div><input ref={challengeInput} type="text" className="bg-gray-200 text-gray-800" onChange={handleChallenge} /></div>
                            </div>

                        )}
                    </>)}

                </>)
            }
        </div>
    )
}