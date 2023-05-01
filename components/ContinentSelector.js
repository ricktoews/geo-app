import { useEffect, useState } from 'react';

const CHECKED = `bg-purple-500`;
const UNCHECKED = `bg-gray-500`;
export default function CheckboxGroup({ continents, setContinentSelection }) {
    const [buttonColors, setButtonColors] = useState({
        'north-america': UNCHECKED,
        'south-america': UNCHECKED,
        europe: UNCHECKED,
        africa: UNCHECKED,
        asia: UNCHECKED,
    });

    useEffect(() => {
        const initContinents = {};
        for (let continent of continents) {
            initContinents[continent] = CHECKED;
        }

        const colors = { ...buttonColors, ...initContinents };
        setButtonColors(colors);
    }, [])

    const continentGroupA = ['north-america', 'south-america'];
    const continentGroupB = ['europe', 'africa', 'asia'];
    function handleContinentClicked(event) {
        const temp = JSON.parse(JSON.stringify(buttonColors));
        const el = event.target;
        const { continent } = el.dataset;
        const toggleToChecked = temp[continent] === UNCHECKED;
        console.log(`====> ${continent} checked ${toggleToChecked}`);

        setButtonColors((prevColors) => (
            {
                ...prevColors,
                [continent]: toggleToChecked ? CHECKED : UNCHECKED,
                ...(toggleToChecked && continentGroupA.indexOf(continent) !== -1 && {
                    europe: UNCHECKED,
                    africa: UNCHECKED,
                    asia: UNCHECKED,
                }),
                ...(toggleToChecked && continentGroupB.indexOf(continent) !== -1 && {
                    'north-america': UNCHECKED,
                    'south-america': UNCHECKED,
                })
            }
        ));
    }


    function handleSetSelection() {
        console.log('====> handleSetSelection', buttonColors);
        const selection = {};
        for (let b in buttonColors) {
            selection[b] = false;
            if (buttonColors[b] === CHECKED) {
                selection[b] = true;
            }
        }

        setContinentSelection(selection);
    }

    return (
        <div className="border border-white rounded-lg my-2">
            <p className="text-white bg-gray-500 font-bold mb-2">Continent Selection</p>
            <div className="flex justify-between px-3">
                <div className="flex flex-col space-y-3 py-3">
                    <div className="flex space-x-3">
                        <div><button onClick={handleContinentClicked} data-continent="north-america" className={`whitespace-normal text-xs leading-none h-5 rounded-full px-4 py-4 ${buttonColors['north-america']} text-white flex items-center`}>North America</button></div>
                        <div><button onClick={handleContinentClicked} data-continent="south-america" className={`whitespace-normal text-xs leading-none h-5 rounded-full px-4 py-4 ${buttonColors['south-america']} text-white flex items-center`}>South America</button></div>
                    </div>
                    <div className="flex space-x-3">
                        <div><button onClick={handleContinentClicked} data-continent="europe" className={`h-5 rounded-full px-4 py-4 ${buttonColors.europe} text-white flex items-center`}>Europe</button></div>
                        <div><button onClick={handleContinentClicked} data-continent="africa" className={`h-5 rounded-full px-4 py-4 ${buttonColors.africa} text-white flex items-center`}>Africa</button></div>
                        <div><button onClick={handleContinentClicked} data-continent="asia" className={`h-5 rounded-full px-4 py-4 ${buttonColors.asia} text-white flex items-center`}>Asia</button></div>
                    </div>
                </div>
                <svg onClick={handleSetSelection} className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
                    <circle cx="15" cy="15" r="15" fill="#4CAF50" />
                    <path d="M10.878 15.357l-2.207-2.207a1.5 1.5 0 0 1 2.121-2.121l1.086 1.086 4.293-4.293a1.5 1.5 0 0 1 2.121 2.121l-5.5 5.5a1.5 1.5 0 0 1-2.121 0z" fill="#fff" transform="translate(2 2)" />
                </svg>
                {/*
                <button onClick={handleSetSelection}>Set Continent Selection</button>
    */}
            </div>
        </div>
    );
}
