import { useEffect, useState } from 'react';

export default function CheckboxGroup({ continents, setContinentSelection }) {
    const [checked, setChecked] = useState({
        'north-america': false,
        'south-america': false,
        europe: false,
        africa: false,
        asia: false,
    });

    useEffect(() => {
        const initContinents = {};
        for (let continent of continents) {
            initContinents[continent] = true;
        }

        setChecked((prevChecked) => ({ ...prevChecked, ...initContinents }));
    }, [])

    const continentGroupA = ['north-america', 'south-america'];
    const continentGroupB = ['europe', 'africa', 'asia'];
    const handleCheckboxChange = (event) => {
        const { name, checked: isChecked } = event.target;
        setChecked((prevChecked) => ({
            ...prevChecked,
            [name]: isChecked,
            ...(isChecked && continentGroupA.indexOf(name) !== -1 && {
                europe: false,
                africa: false,
                asia: false,
            }),
            ...(isChecked && continentGroupB.indexOf(name) !== -1 && {
                'north-america': false,
                'south-america': false,
            }),
        }));
    };

    function handleSetSelection() {
        setContinentSelection(checked);
    }

    return (
        <div className="border border-white rounded-lg p-4 space-y-4">
            <p className="text-white font-bold mb-2">Continent Selection</p>
            <div className="flex space-x-4">
                <label className="inline-flex items-center text-white">
                    <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-white"
                        name="north-america"
                        checked={checked['north-america']}
                        onChange={handleCheckboxChange}
                    />
                    <span className="ml-2">North America</span>
                </label>
                <label className="inline-flex items-center text-white">
                    <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-white"
                        name="south-america"
                        checked={checked['south-america']}
                        onChange={handleCheckboxChange}
                    />
                    <span className="ml-2">South America</span>
                </label>
            </div>
            <div className="flex space-x-4">
                <label className="inline-flex items-center text-white">
                    <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-white"
                        name="europe"
                        checked={checked.europe}
                        onChange={handleCheckboxChange}
                    />
                    <span className="ml-2">Europe</span>
                </label>
                <label className="inline-flex items-center text-white">
                    <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-white"
                        name="africa"
                        checked={checked.africa}
                        onChange={handleCheckboxChange}
                    />
                    <span className="ml-2">Africa</span>
                </label>
                <label className="inline-flex items-center text-white">
                    <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-white"
                        name="asia"
                        checked={checked.asia}
                        onChange={handleCheckboxChange}
                    />
                    <span className="ml-2">Asia</span>
                </label>
            </div>
            <button onClick={handleSetSelection}>Set Continent Selection</button>
        </div>
    );
}
