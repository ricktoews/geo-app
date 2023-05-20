import { useEffect, useState } from 'react';
const SITES_IMAGE_CLASS = 'h-12 ml-1';
/*
const SITES = [
    { "label": "Brandenburg Gate", "img": "brandenburg-gate.png" },
    { "label": "Eiffel Tower", "img": "eiffel-tower.png" },
    { 'label': 'Sintra', 'img': 'sintra.png' },
    { 'label': 'Church of Notre Dame, Dinant', 'img': 'dinant-church.png' },
    { 'label': 'Matterhorn', 'img': 'matterhorn.png' }
];
*/
const SITES = [];

const Sites = ({ handleItemClick, sites }) => {
    const [sitesToVisit, setSitesToVisit] = useState([]);

    useEffect(() => {
        const tmp = [];
        sites.forEach(item => {
            const site = item[0];
            tmp.push(site);
        })
        setSitesToVisit(tmp);
    }, []);

    function handleClick(e) {
        const el = e.currentTarget;
    }

    function makeFileName(str) {
        str = str.replaceAll(' ', '-');
        const filename = '/images/shapes/' + str.toLowerCase() + '.png';
        return filename;
    }

    return (
        <div className="flex justify-between">
            {sitesToVisit.map((item, key) => {
                return <div key={key} onClick={handleItemClick} data-src={`/images/sites/${item.img}`} data-label={item.label}
                    className="rounded-full w-14 h-14 bg-white bg-center bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url('/images/sites/${item.img}')` }}
                ></div>
            })}
        </div>
    );
};

export default Sites;
