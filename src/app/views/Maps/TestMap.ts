/*
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */

let marker: google.maps.Marker
let geocoder: google.maps.Geocoder
let responseDiv: HTMLDivElement
let inputDiv: HTMLDivElement
let response: HTMLPreElement
let _waypoints: google.maps.DirectionsWaypoint[] = [
    { location: 'ROLLA AL NABBA', stopover: true },
    {
        location:
            'YASIN KHAMIS BUILDING MATERIALS TRADING - AL WARQA 1 , DUBAI , UAE',
        stopover: true,
    },
]

const event = new Event('build')

function initMap(invoices): void {
    const map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
            zoom: 2,
            center: { lat: 40.756795, lng: -73.954298 }, // UAE.
        }
    )
    const trafficLayer = new google.maps.TrafficLayer()

    trafficLayer.setMap(map)

    //Geocoder

    geocoder = new google.maps.Geocoder()

   
  
   

    const inputText = document.createElement('input')
    inputText.classList.add('input__search')
    inputText.type = 'text'
    inputText.placeholder = 'Enter a location'

    const submitButton = document.createElement('input')

    submitButton.type = 'button'
    submitButton.value = 'Geocode'
    submitButton.classList.add('button', 'button-primary')

    const clearButton = document.createElement('input')

    clearButton.type = 'button'
    clearButton.value = 'Clear'
    
    clearButton.classList.add('button', 'button-secondary')

    inputDiv = document.createElement('div')
    inputDiv.classList.add('input__container')
    inputDiv.appendChild(inputText)
    inputDiv.appendChild(submitButton)
    inputDiv.appendChild(clearButton)


    response = document.createElement('pre')
    response.id = 'response'
    response.innerText = ''

    responseDiv = document.createElement('div')
    responseDiv.id = 'response-container'
    responseDiv.appendChild(response)

    
  

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText)
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton)
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(clearButton)

    // map.controls[google.maps.ControlPosition.LEFT_TOP].push(responseDiv)

    marker = new google.maps.Marker({
        map,
    })

    map.addListener('click', (e: google.maps.MapMouseEvent) => {
        geocode({ location: e.latLng }, map, invoices)
    })

    submitButton.addEventListener('click', () => {
        inputText.value.length < 1 ? inputText.value ='dubai' : inputText.value = inputText.value
        geocode({ address: inputText.value  }, map, invoices)
        inputText.value= ''
    }
    )
   

    clearButton.addEventListener('click', () => {
        clear()
    })

    clear()
}

function clear() {
    marker.setMap(null)
    responseDiv.style.display = 'none'
}

function geocode(
    request: google.maps.GeocoderRequest,
    map: google.maps.Map,
    invoices: any[]
): void {
    clear()

    geocoder
        .geocode(request)
        .then((result) => {
            const { results } = result


            map.setCenter(results[0].geometry.location)
            // marker.setPosition(results[0].geometry.location)
            _waypoints.push({
                location: results[0].formatted_address,
                stopover: true,
            })

            const map2 = document.getElementById('map') as HTMLElement

            marker.setMap(map)
            //   responseDiv.style.display = "block";
            //   response.innerText = JSON.stringify(result, null, 2);
            // Dispatch the event.
            map2.dispatchEvent(event)
            return results
        })
        .catch((e) => {
            alert('Geocode was not successful for the following reason: ' + e)
        })

    //Directions

    const waypoints : any[] = invoices.map((invoice) => {
        return {
        location: invoice.deliveryAddress === "" ? invoice.customerName : invoice.deliveryAddress,
        stopover: true,
    }});

    const directionsService = new google.maps.DirectionsService()
    const directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        map,
        panel: document.getElementById('panel') as HTMLElement,
    })

    directionsRenderer.addListener('directions_changed', () => {
        const directions = directionsRenderer.getDirections()

        if (directions) {
            computeTotalDistance(directions)
        }
    })
    const map2 = document.getElementById('map') as HTMLElement
    map2.addEventListener('build', (e) => {
        displayRoute(
            'Maleha St - Industrial Area - Industrial Area 13 - Sharjah - United Arab Emirates',
            waypoints,
            directionsService,
            directionsRenderer
        )
    })
}

function displayRoute(
    origin: string,
    waypoints: any[],
    service: google.maps.DirectionsService,
    display: google.maps.DirectionsRenderer
) {
    service
        .route({
            origin: origin,
            destination: 'Maleha St - Industrial Area - Industrial Area 13 - Sharjah - United Arab Emirates',
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
            avoidTolls: true,
            provideRouteAlternatives: true,
            drivingOptions: {
                departureTime: new Date(Date.now()),
            },
            optimizeWaypoints: true,
        })
        .then((result: google.maps.DirectionsResult) => {
            display.setDirections(result)
        })
        .catch((e) => {
            alert('Could not display directions due to: ' + e)
        })
}

function computeTotalDistance(result: google.maps.DirectionsResult) {
    let total = 0
    const myroute = result.routes[0]

    if (!myroute) {
        return
    }

    for (let i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i]!.distance!.value
    }

    total = total / 1000
    ;(document.getElementById('total') as HTMLElement).innerHTML = total + ' km'
}

export { initMap }


// AIzaSyCanufZm6Nl9vevW7Xr4TPaPTBPMXSs7kA