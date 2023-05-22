import { useEffect, useRef, useState } from 'react';
import ImageGrid from '@/components/ImageGrid';
import ContinentSelector from '@/components/ContinentSelector';
import Sites from '@/components/Sites';
import Popup from '@/components/Popup';
import CountryMap from '@/components/CountryMap';
import DrawerItems from '@/components/DrawerItems';
import { getGeoPath } from '../utils/get-path';
import { normalizeString } from '../utils/helpers';
import { getMappingData, selectSites } from '../utils/map-helpers';

import countries from '../data/borders.json';

const STARTING_ROUTE_POINTS = 10;
const POINTS_PER_CHALLENGE = 3;

export default function Game(props) {
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupItem, setPopupItem] = useState({});
    const [poolContinents, setPoolContinents] = useState([]);
    const [origCountry, setOrigCountry] = useState('');
    const [destCountry, setDestCountry] = useState('');
    const [countryObject, setCountryObject] = useState(null);
    const [mappingData, setMappingData] = useState({});
    const [challengeCountry, setChallengeCountry] = useState({});
    const [currentBorders, setCurrentBorders] = useState([]);
    const [countryPool, setCountryPool] = useState([]);
    const [filenames, setFilenames] = useState([]);
    const [geoPath, setGeoPath] = useState();
    const [myPath, setMyPath] = useState([]);
    const [currentShortestPath, setCurrentShortestPath] = useState([]);
    const [arrived, setArrived] = useState(false);
    const [routePoints, setRoutePoints] = useState(0);
    const [challengePoints, setChallengePoints] = useState(0);
    const challengeInput = useRef(null);
    const [coords, setCoords] = useState({});
    const [sitesToVisit, setSitesToVisit] = useState(null);


    function selectPoolForContinents(continents) {
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
        setArrived(false);
        setMyPath([]);
        setCurrentShortestPath([]);
        setCountryPool(countries);
        setRoutePoints(0);
        setChallengePoints(0);
        setChallengeCountry(0);
        setSitesToVisit([]);

        const pool = selectPoolForContinents(poolContinents);
        setSitesToVisit(selectSites(countries, poolContinents));
        setFilenames(pool.map(item => item.country));
        const countryCount = pool.length;
        const origNdx = Math.floor(Math.random() * countryCount);
        const destNdx = Math.floor(Math.random() * countryCount);
        const randOrigin = pool[origNdx].country;
        const randDest = pool[destNdx].country;
        setOrigCountry(randOrigin);
        console.log('====> setCountryObject', pool[origNdx]);
        setCountryObject(pool[origNdx]);


        setCoords(pool[origNdx].center);
        setDestCountry(randDest);
        setCurrentBorders(pool[origNdx].borders);

    }

    useEffect(() => {
        setPoolContinents(['europe']);
    }, []);

    useEffect(() => {
        //        console.log('====> set new continent selection; poolContinents:', poolContinents);
        if (poolContinents.length > 0) {
            start();
        }

    }, [poolContinents]);

    useEffect(() => {
        if (origCountry.length > 0 && destCountry.length > 0) {
            const result = getGeoPath(origCountry, destCountry);
            setGeoPath(result.path);
            setCurrentShortestPath(result.path);
            const _path = JSON.parse(JSON.stringify(myPath));
            _path.push(origCountry);
            setMyPath(_path);
            setRoutePoints(STARTING_ROUTE_POINTS);
        }
    }, [destCountry])

    useEffect(() => {
        if (arrived && geoPath.length < myPath.length) {
            //            console.log('====> Looks like a mite too far', geoPath, myPath);
            let penalty = myPath.length - geoPath.length;
            setRoutePoints(STARTING_ROUTE_POINTS - penalty);
        }
    }, [arrived])

    useEffect(() => {
        //        console.log('====> challengeCountry changed; input', challengeInput);
        if (challengeInput.current) {
            challengeInput.current.focus();
        }
    }, [challengeCountry])

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
        const _mappingData = getMappingData(countryName, countries);
        const _path = JSON.parse(JSON.stringify(myPath));
        _path.push(countryName);
        setMyPath(_path);
        const newShortest = getGeoPath(countryName, destCountry);
        setCurrentShortestPath(newShortest.path);

        if (countryName === destCountry) {
            setArrived(true);
        }
        const countryObj = getCountryObject(countryName);
        setMappingData(_mappingData);
        setCoords(_mappingData.center);
        console.log('====> setCountryObject', countryObj);
        setCountryObject(countryObj);
        setOrigCountry(countryName);
        setCurrentBorders(countryObj.borders);
        setSitesToVisit(selectSites(countries, poolContinents));
        setChallengeCountry({});
    }

    function countryChallenge(countryName) {
        const countryObj = getCountryObject(countryName);
        setChallengeCountry(countryObj);
    }

    function checkCapitalInput(input) {
        const value = normalizeString(input);
        const expected = normalizeString(challengeCountry.capital);
        const capitalsList = expected.split('|');
        let result = false;
        for (let capital of capitalsList) {
            if (capital === value) result = true;
        }

        return result;
    }

    function handleChallenge(event) {
        const el = event.target;
        const result = checkCapitalInput(el.value);
        if (result) {
            setChallengePoints(challengePoints + POINTS_PER_CHALLENGE)
            setNewOrigin(challengeCountry.country);
        }
    }

    function handlePass(event) {
        console.log('====> PASS ON CHALLENGE; set country to', challengeCountry.country);
        setNewOrigin(challengeCountry.country);
    }

    function handleCountryClick(event) {
        const el = event.currentTarget;
    }

    function handleItemClick(event) {
        const el = event.currentTarget;
        const { src, label } = el.dataset;
        setPopupOpen(true);
        setPopupItem({ selected: true, name: label, src, mappingData });
    }

    return !origCountry || !destCountry ? null : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
            <Popup active={popupOpen} handleItemClick={handleItemClick} setPopupOpen={setPopupOpen} popupItem={popupItem} />
            <div className="h-10">Countries of: {poolContinents}</div>


            {
                poolContinents.length > 0 && (<>
                    <div className="flex justify-between">
                        <div onClick={handleCountryClick} className="relative w-1/2 flex flex-col items-center justify-center">
                            <div><img src={makeFileName(origCountry)} alt={origCountry} className="mx-auto max-h-10 object-contain" /></div>
                            <div id="origin-label" className="rounded-lg text-xs text-center bg-gray-300 bg-opacity-50 text-white mt-1 px-1">{origCountry}</div>
                        </div>
                        <div onClick={handleCountryClick} className="relative w-1/2 flex flex-col items-center justify-center">
                            <div><img src={makeFileName(destCountry)} alt={destCountry} className="mx-auto max-h-10 object-contain" /></div>
                            <div id="dest-label" className="rounded-lg text-xs text-center bg-gray-300 bg-opacity-50 text-white mt-1 px-1">{destCountry}</div>
                        </div>
                    </div>
                    {false && !arrived && (<div className="flex justify-center">
                        <div>Shortest path: {currentShortestPath.join(', ')} (Steps: {currentShortestPath.length - 1})</div>
                    </div>)}
                    {arrived && (<div className="mx-5 flex flex-col items-center justify-center">
                        <div>Route Points: {routePoints}</div>
                        <div>Challenge Points: {challengePoints}</div>
                    </div>)}

                    <hr className="my-2" />

                    <Sites handleItemClick={handleItemClick} sites={sitesToVisit} />

                    <hr className="my-2" />
                    {arrived && (<div>
                        <div>YOU HAVE ARRIVED!</div>
                        <div>Your path: {myPath.join(', ')} (Steps: {myPath.length})</div>
                        <div>Shortest path: {geoPath.join(', ')} (Steps: {geoPath.length})</div>
                        <hr className="my-5" />
                        <div className="flex justify-center"><button className="whitespace-normal leading-none h-5 rounded-full px-4 py-4 bg-purple-500 text-white flex items-center" onClick={start}>Again!</button></div>
                    </div>)}

                    {!arrived && (<>
                        <ImageGrid filenames={currentBorders} setNewOrigin={countryChallenge} />
                        {challengeCountry.capital && (
                            <div className="flex flex-col justify-center items-center">
                                <div>Challenge: What&apos;s the capital of {challengeCountry.country}?</div>
                                <div className="mt-3"><input ref={challengeInput} type="text" className="outline-none bg-purple-500 text-gray-800" onChange={handleChallenge} /></div>
                                <div className="mt-3"><button className="whitespace-normal leading-none h-5 rounded-full px-4 py-4 bg-purple-500 text-white flex items-center" onClick={handlePass}>Pass</button></div>
                            </div>

                        )}
                    </>)}

                </>)
            }
            <DrawerItems>
                <ContinentSelector header="Content Selector" continents={poolContinents} setContinentSelection={setContinentSelection} />
                <CountryMap header="Map" countryObject={countryObject} />
            </DrawerItems>
        </div>
    )
}

