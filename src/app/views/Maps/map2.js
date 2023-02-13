import React, { Component } from 'react'
import { withGoogleMap, GoogleMap, DirectionsRenderer } from 'react-google-maps'
class Map extends Component {
    state = {
        directions: null,
    }

    componentDidMount() {
        const directionsService = new window.google.maps.DirectionsService()

        const origin = { lat: 40.756795, lng: -73.954298 }
        const destination = { lat: 41.756795, lng: -78.954298 }
        const waypt = [
            {
                location: { lat: 40.278022, lng: -76.899615 },
                stopover: true,
            },
            {
                location: { lat: 40.750216, lng: -78.922049 },
                stopover: true,
            },
        ]

        directionsService.route(
            {
                origin: origin,
                destination: destination,
                waypoints: waypt,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    this.setState({
                        directions: result,
                    })
                } else {
                    console.error(`error fetching directions ${result}`)
                }
            }
        )
    }

    render() {
        const GoogleMapExample = withGoogleMap((props) => (
            <GoogleMap
                defaultCenter={{ lat: 25.276987, lng: 55.296249 }}
                defaultZoom={13}
            >
                {this.state.directions && (
                    <DirectionsRenderer directions={this.state.directions} />
                )}
            </GoogleMap>
        ))

        return (
            <div>
                <GoogleMapExample
                    containerElement={
                        <div style={{ height: `500px`, width: '500px' }} />
                    }
                    mapElement={<div style={{ height: `100%` }} />}
                />
            </div>
        )
    }
}

export default Map
