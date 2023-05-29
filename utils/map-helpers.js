import { MAX_SITES, GEOJSON_URL, DEFAULT_ZOOM } from '@/utils/constants';
import ZOOM_LEVELS from '@/data/zoom-levels.json';

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


export function selectSites(countries, continents) {
    const poolForContinents = selectPoolForContinents(continents, countries);
    const sites = poolForContinents.filter(item => item.sites)
        .map(item => item.sites);
    const selected = shuffleArray(sites);
    while (selected.length > MAX_SITES) {
        selected.pop();
    }

    console.log('====> sites', selected);
    return selected;
}


export function selectPoolForContinents(continents, countries) {
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


export function getCountryObject(country, pool = []) {
    const countryObj = pool.find(obj => obj.country === country);
    if (!countryObj) return {};
    return countryObj;
}


export function getMappingData(countryName, pool = []) {
    const obj = getCountryObject(countryName, pool);
    const borderingCountries = [];
    const borderingData = obj.borders.map(item => {
        const borderingCountryObj = getCountryObject(item, pool);
        const { country, iso3166 } = borderingCountryObj;
        borderingCountries.push({ country, code: iso3166 });
    });
    const mappingData = {
        country: obj.country,
        code: obj.iso3166,
        center: obj.center,
        borderingCountries
    }
    console.log('====> getMappingData', mappingData);
    return mappingData;
}

export async function getGeoJSON(country) {
    const url = GEOJSON_URL + country;
    let result = await fetch(url);
    result = await result.json();
    return result;
}


/*
const ZOOM_LEVELS = {};

ZOOM_LEVELS['Europe'] = {
    "9": ['Monaco', 'San Marino', 'Vatican City'],
    "7": ['Andorra', 'Liechtenstein', 'Luxembourg'],
    "4": ["Albania", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Czechia", "Denmark", "Estonia", "France", "Germany", "Greece", "Hungary", "Italy", "Kosovo", "Latvia", "Lithuania", "Moldova", "Montenegro", "Netherlands", "North Macedonia", "Poland", "Portugal", "Romania", "Serbia", "Slovakia", "Slovenia", "Spain", "Switzerland", "Turkey", "Ukraine"],
    "3": ['Finland', 'Norway', 'Sweden'],
    "1": ['Russia']
}

ZOOM_LEVELS['South America'] = {
    "5": [
        "Suriname"
    ],
    "4": [
        "Uruguay",
        "Venezuela",
        "Ecuador",
        "Guyana"
    ],
    "3": [
        "Bolivia",
        "Colombia",
        "Paraguay",
        "Peru"
    ],
    "2": ['Argentina', 'Brazil', 'Chile']
}

ZOOM_LEVELS['North America'] = {
    "5": ["Belize", "Costa Rica", "El Salvador", "Guatemala", "Honduras", "Nicaragua", "Panama"],
    "3": ['Mexico'],
    "2": ['Canada', 'United States'],
}

ZOOM_LEVELS['Africa'] = {
    "3": [
        "Algeria",
        "Angola",
        "Botswana",
        "Cameroon",
        "Central African Republic",
        "Chad",
        "Democratic Republic of the Congo",
        "Republic of the Congo",
        "Ivory Coast",
        "Egypt",
        "Ethiopia",
        "Kenya",
        "Libya",
        "Mali",
        "Mauritania",
        "Morocco",
        "Mozambique",
        "Namibia",
        "Niger",
        "Nigeria",
        "Somalia",
        "South Africa",
        "South Sudan",
        "Sudan",
        "Tanzania",
        "Zambia",
        "Zimbabwe"
    ],
    "4": [
        "Burkina Faso",
        "Eritrea",
        "Gabon",
        "Ghana",
        "Guinea",
        "Malawi",
        "Tunisia",
        "Uganda"
    ],
    "5": [
        "Benin",
        "Burundi",
        "Equatorial Guinea",
        "The Gambia",
        "Liberia",
        "Senegal",
        "Sierra Leone",
        "Togo"
    ],
    "6": [
        "Djibouti",
        "Eswatini",
        "Guinea-Bissau",
        "Lesotho",
        "Rwanda"
    ]
}

ZOOM_LEVELS['Asia'] = {
    "1": [
        "Russia"
    ],
    "2": [
        "China",
        "Kazakhstan"
    ],
    "3": [
        "India",
        "Indonesia",
        "Iran",
        "Iraq",
        "Malaysia",
        "Mongolia",
        "Myanmar",
        "Pakistan",
        "Saudi Arabia",
        "Thailand"
    ],
    "4": [
        "Afghanistan",
        "Kyrgyzstan",
        "Laos",
        "Nepal",
        "Oman",
        "Syria",
        "Tajikistan",
        "Turkey",
        "Turkmenistan",
        "Uzbekistan",
        "Vietnam",
        "Yemen"
    ],
    "5": [
        "Armenia",
        "Azerbaijan",
        "Bangladesh",
        "Bhutan",
        "Cambodia",
        "East Timor",
        "Georgia",
        "Israel",
        "Jordan",
        "North Korea",
        "South Korea",
        "Palestine",
        "United Arab Emirates"
    ],
    "6": [
        "Kuwait",
        "Lebanon",
        "Qatar"
    ],
    "7": [
        "Brunei"
    ]
}*/

export function adjustZoom(country, continent) {
    // Attempt to get zoom level by country name.
    const zoomLevels = ZOOM_LEVELS[continent];
    for (let zoom in zoomLevels) {
        if (zoomLevels[zoom].indexOf(country) !== -1) {
            const numericZoom = parseInt(zoom, 10);
            return numericZoom;
        }
    }

    // Otherwise...
    return DEFAULT_ZOOM;
}