const SITES_IMAGE_CLASS = 'h-12 ml-1';
const SITES = [
    { "label": "Brandenburg Gate", "img": "brandenburg-gate.png" },
    { "label": "Eiffel Tower", "img": "eiffel-tower.png" },
    { 'label': 'Sintra', 'img': 'sintra.png' },
    { 'label': 'Church of Notre Dame, Dinant', 'img': 'dinant-church.png' },
    { 'label': 'Matterhorn', 'img': 'matterhorn.png' }
];

const Sites = ({ handleItemClick }) => {

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
            {SITES.map((item, key) => {
                return <img key={key} onClick={handleItemClick} data-type="site" data-label={item.label} src={`/images/sites/${item.img}`} className={SITES_IMAGE_CLASS} />
            })}
        </div>
    );
};

export default Sites;
