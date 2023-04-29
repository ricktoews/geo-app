import Image from 'next/image';

const ImageGrid = ({ filenames, setNewOrigin }) => {

    function handleClick(e) {
        const el = e.currentTarget;
        const { country } = el.dataset;
        setNewOrigin(country);
    }

    function makeFileName(str) {
        str = str.replaceAll(' ', '-');
        const filename = '/images/shapes/' + str.toLowerCase() + '.png';
        return filename;
    }

    return (
        <div className="flex flex-wrap -mx-2">
            {filenames.map((country) => (
                <div key={country} onClick={handleClick} data-country={country} className="w-1/5 px-2 mb-4">
                    <img
                        src={makeFileName(country)}
                        alt={country}
                        className="max-h-10"
                    />
                </div>
            ))}
        </div>
    );
};

export default ImageGrid;
