import React, { useEffect, useRef } from "react";


const Map = ({ country, borderingCountries }) => {
    const googleMapRef = useRef(null);

    useEffect(() => {
        // Load the Google Maps API script

        // Initialize the map once the API script is loaded
        googleMapsScript.addEventListener("load", () => {
            const map = new window.google.maps.Map(googleMapRef.current, {
                center: { lat: 0, lng: 0 },
                zoom: 2,
            });

            // Use the Geocoder to get the latitude and longitude of the country
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: country }, (results, status) => {
                if (status === "OK") {
                    const countryLocation = results[0].geometry.location;
                    map.setCenter(countryLocation);

                    // Add a marker for the country
                    const countryMarker = new window.google.maps.Marker({
                        position: countryLocation,
                        map,
                        title: country,
                    });

                    // Add borders for the country
                    const borders = borderingCountries.map((borderingCountry) => {
                        return { country: borderingCountry, map };
                    });
                    addBorders(borders);
                } else {
                    console.error(`Geocode was not successful for the following reason: ${status}`);
                }
            });
        });
    }, [borderingCountries, country]);

    const addBorders = (borders) => {
        borders.forEach((border) => {
            // Use the Geocoder to get the latitude and longitude of the bordering country
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: border.country }, (results, status) => {
                if (status === "OK") {
                    const borderLocation = results[0].geometry.location;

                    // Add a line for the border
                    const borderLine = new window.google.maps.Polyline({
                        path: [countryLocation, borderLocation],
                        map: border.map,
                        strokeColor: "#FF0000",
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                    });
                } else {
                    console.error(`Geocode was not successful for the following reason: ${status}`);
                }
            });
        });
    };

    return <div ref={googleMapRef} style={{ height: "500px", width: "100%" }} />;
};

export default Map;
