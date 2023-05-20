import { MAX_SITES, GEOJSON_URL } from '@/utils/constants';

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
