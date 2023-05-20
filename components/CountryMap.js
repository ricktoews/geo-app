import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import Border from './Border';
import { DEFAULT_ZOOM } from '@/utils/constants';

const OPTIONS = {
    disableDefaultUI: true
};

export default function CountryMap({ countryObject }) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_API_KEY,
    });

    const { country, center } = countryObject;
    return (
        <div className="bottom-5 fixed left-1/2 transform -translate-x-1/2">
            {isLoaded ? (<GoogleMap options={OPTIONS} zoom={DEFAULT_ZOOM} center={center} mapContainerClassName="map-container">
                <Border country={country} />
            </GoogleMap>) : null}
        </div>
    )
}
