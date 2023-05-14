function getCountryObject(country, pool = []) {
    const countryObj = pool.find(obj => obj.country === country);
    if (!countryObj) return {};
    return countryObj;
}

exports.getCountryObject = getCountryObject;

function getMappingData(countryName, pool = []) {
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

exports.getMappingData = getMappingData;