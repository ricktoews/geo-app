import { useRef } from 'react';
import { POPUP_IMG_WIDTH, POPUP_IMG_HEIGHT } from '@/utils/constants';

const ZOOM_LEVEL = 9;

export default function Popup({ handleItemClicked, active, setPopupOpen, popupItem }) {
    const closeContainerRef = useRef(null);
    const closeBtnRef = useRef(null);
    const popupContentRef = useRef(null);
    const mapRef = useRef(null);
    const { mappingData = {} } = popupItem;

    const LATITUDE = mappingData.center?.lat;
    const LONGITUDE = mappingData.center?.long;
    const COUNTRY_CODE = mappingData.code;

    const popupContainerStyle = {};
    popupContainerStyle.display = active ? 'flex' : 'none';

    var map;

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: LATITUDE, lng: LONGITUDE },
            zoom: ZOOM_LEVEL
        });
        var country = new google.maps.Data();
        country.loadGeoJson('https://raw.githubusercontent.com/johan/world.geo.json/master/countries/' + COUNTRY_CODE + '.geo.json');
        var bordering = new google.maps.Data();
        bordering.loadGeoJson('https://raw.githubusercontent.com/johan/world.geo.json/master/countries/' + YOUR_BORDERING_COUNTRIES_CODES + '.geo.json');
        country.setMap(map);
        bordering.setMap(map);
    }

    const thumbStyle = {
        maxHeight: `${POPUP_IMG_HEIGHT}px`,
        maxWidth: `${POPUP_IMG_WIDTH}px`,
        border: '1px solid white'
    };
    if (!popupItem.selected) {
        thumbStyle.filter = 'saturate(20%)';
    }

    const handleClose = e => {
        setPopupOpen(false);
    }

    const handleOuterClick = e => {
        e.preventDefault();
        const { target } = e;
        const { current } = popupContentRef;
        const clickedInPopup = target === current || current.contains(target);
        if (!clickedInPopup) {
            setPopupOpen(false);
        }
    }

    return (
        <div ref={closeContainerRef} onClick={handleOuterClick} className="fixed z-50 top-0 left-0 flex justify-center w-screen h-screen bg-white bg-opacity-20" style={popupContainerStyle}> {/* full page transparent overlay block */}

            <div className="relative top-20 flex flex-col justify-start items-center w-90 overflow-y-auto text-white p-10"> {/* wrapper to provide a maximum height for popup block */}

                <div ref={popupContentRef} className="border-2 border-black bg-black relative text-inherit w-full mb-10 p-10 max-h-full flex flex-col items-center">  {/* visible popup content */}

                    {/* Close Popup icon */}
                    <div className="absolute top-5 right-5 z-150 cursor-pointer">
                        <svg ref={closeBtnRef} onClick={handleClose} viewBox="0 0 35 35" width="35" height="35">
                            <circle cx="17.5" cy="17.5" r="16.5" fill="#ccc"></circle>
                            <path stroke="#fff" strokeWidth="3" d="M9.5 9.5l16.5 16.5M26 9.5L9.5 26"></path>
                        </svg>
                    </div>

                    {/* Image thumbnail and information layout */}
                    <div style={{ width: 'auto' }}>

                        <div style={{ marginBottom: '20px' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ marginRight: '10px' }}>
                                <ul style={{ fontSize: '8pt', color: 'inherit' }} className="list-none">
                                    <li>{popupItem.artist}</li>
                                    <li>{popupItem.date}</li>
                                </ul>

                            </div>
                            <div>
                                <div className="flex cursor-pointer justify-center" onClick={handleItemClicked}>
                                    <img src={popupItem.src} style={thumbStyle} />
                                </div>
                                <div className="mt-2 text-center">{popupItem.name}</div>
                            </div>
                        </div>

                    </div>


                </div>
            </div>
        </div >
    )
}