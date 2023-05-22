import { useEffect, useState } from 'react';
import Drawer from './Drawer';

const CHECKED = `bg-purple-500`;
const UNCHECKED = `bg-gray-500`;
export default function CheckboxGroup({ continents, setContinentSelection, hortonHearsAWho }) {
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
        const selection = {};
        for (let b in buttonColors) {
            selection[b] = false;
            if (buttonColors[b] === CHECKED) {
                selection[b] = true;
            }
        }
        // Notify DrawerItems to close drawer.
        if (hortonHearsAWho) {
            hortonHearsAWho(selection);
        }

        setContinentSelection(selection);
    }

    return (
        <div className="h-60 flex justify-center">
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
                <button onClick={handleSetSelection}><img className="bg-white rounded-full h-16" src="/images/green-checkmark.png" /></button>
            </div>
        </div>
    );
}
