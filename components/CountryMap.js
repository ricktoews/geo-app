import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import Border from './Border';
import Drawer from './Drawer';
import { DEFAULT_ZOOM } from '@/utils/constants';

const OPTIONS = {
    disableDefaultUI: true
};

export default function CountryMap({ countryObject }) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_API_KEY,
    });

    const { country, center } = countryObject;
    return (<>
        {isLoaded ? (<div className="flex justify-center">
            <GoogleMap options={OPTIONS} zoom={DEFAULT_ZOOM} center={center} mapContainerClassName="map-container">
                <Border country={country} />
            </GoogleMap>
        </div>) : null}

    </>
    )
}
