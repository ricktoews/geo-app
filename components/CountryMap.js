import { useRef, useState } from 'react';
import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import Border from './Border';
import { DEFAULT_ZOOM } from '@/utils/constants';

const OPTIONS = {
    disableDefaultUI: true
};

export default function CountryMap({ countryObject }) {
    const [panelState, setPanelState] = useState(false);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_API_KEY,
    });

    const panelRef = useRef(null);

    function handleClick(e) {
        setPanelState(!panelState);
    }
    const { country, center } = countryObject;
    return (<>
        <div ref={panelRef} onClick={handleClick} className={`${panelState ? 'translate-y-60' : 'translate-y-0'} transition-all duration-500 fixed bottom-0 left-0 w-screen bg-slate-500 border-t border-white`}>
            <div className="flex items-center justify-center pt-1 pb-1 bg-slate-400 border-b border-white">
                <h2 className="ml-2">Toggle Map</h2>
            </div>
            <div className="h-250">
                <div className="flex justify-center">
                    {isLoaded ? (<GoogleMap options={OPTIONS} zoom={DEFAULT_ZOOM} center={center} mapContainerClassName="map-container">
                        <Border country={country} />
                    </GoogleMap>) : null}
                </div>
            </div>
        </div>
    </>
    )
}
