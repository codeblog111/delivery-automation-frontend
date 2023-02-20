/*
 * Copyright 2021 Google LLC. All Rights Reserved.
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

import * as React from 'react'
import DraggableList from 'react-draggable-lists'
import * as ReactDom from 'react-dom'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import { createCustomEqual } from 'fast-equals'
import { isLatLngLiteral } from '@googlemaps/typescript-guards'
import TransferList from './TransferList'
import locationData from './locationData.js'; 
import driverData from './driverData.js'; 
import items from './DB/items.json';
import {
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Popover,
    Select,
    TextField,
} from '@mui/material'
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { Navigate, useNavigate } from 'react-router-dom'
import RenderMap from './RenderMap'
import axiosInstance from "axios";

const render = (status: Status) => {
    return <h1>{status}</h1>
}

const Asssignment: React.VFC = () => {
    const navigate = useNavigate()
    // Popover State
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [popover, setPopover] = React.useState(null)
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
        setPopover(null)
    }

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

    // End of Popover State
    const [clicks, setClicks] = React.useState<google.maps.LatLng[]>([])
    const [zoom, setZoom] = React.useState(7) // initial zoom
    const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
        lat: 23.4241,
        lng: 53.8478,
    })

    const onClick = (e: google.maps.MapMouseEvent) => {
        // avoid directly mutating state
        setClicks([...clicks, e.latLng!])
    }

    const onIdle = (m: google.maps.Map) => {
        console.log('onIdle')
        setZoom(m.getZoom()!)
        setCenter(m.getCenter()!.toJSON())
    }

    //Date Picker state
    const [selectedDate, setSelectedDate] = React.useState(Date.now())
    function handleDateChange(date) {
        setSelectedDate(date)
        console.log("Date is: ", new Date(Date.parse(date)));
    }

    //Select Driver State
    const handleChangeDeliveryStatus = (event) => {
        setDriver(event.target.value)
    }
    const [driver, setDriver] = React.useState('Ilyas Ahmad')
    //Select cars State
    const handleChangeCar = (event) => {
        setCar(event.target.value)
    }
    const [car, setCar] = React.useState('ford')
    var carArray = [
        {
            name: '311',
        },
        {
            name: '58',
        },
        {
            name: '20416',
        },
    ]
    const subscribarList = [
        {
            name: 'Ilyas Ahmad',
            status: 'available',
            vehicles: [
                {
                    name: 'ford',
                },
                {
                    name: 'mitsubishi',
                },
                {
                    name: 'HINO',
                },
            ],
        },
        {
            name: 'Waqas Ali',
            status: 'unavailable',
            vehicles: [
                {
                    name: 'ford',
                },
                {
                    name: 'mitsubishi',
                },
                {
                    name: 'HINO',
                },
            ],
        },
        {
            name: 'Waqas Ali',
            status: 'sick',
            vehicles: [
                {
                    name: 'ford',
                },
                {
                    name: 'mitsubishi',
                },
                {
                    name: 'HINO',
                },
            ],
        },
        {
            name: 'Guldad Khan',
            status: 'unavailable',
            vehicles: [
                {
                    name: 'ford',
                },
                {
                    name: 'mitsubishi',
                },
                {
                    name: 'HINO',
                },
            ],
        },
        {
            name: 'Rajab Ali',
            status: 'available',
            vehicles: [
                {
                    name: 'ford',
                },
                {
                    name: 'mitsubishi',
                },
                {
                    name: 'HINO',
                },
            ],
        },
        {
            name: 'Rajab Ali',
            status: 'unavailable',
            vehicles: [
                {
                    name: 'ford',
                },
                {
                    name: 'mitsubishi',
                },
                {
                    name: 'HINO',
                },
            ],
        },
    ]

    const [routes, setRoutes] = React.useState<any[]>([]);
    const [confirmedInvoices, setConfirmedInvoices] = React.useState<any[]>([]);
    const [matchedDrivers, setMatchedDrivers] = React.useState<any[]>([]);
    const [matchedVehicles, setMatchedVehicles] = React.useState<any[]>([]);
    const [invoices, setInvoices] = React.useState<any[]>([]);
    const [productsWeight, setProductsWeight] = React.useState(0);
    const [productsVolume, setProductsVolume] = React.useState(0);


    function checkStringPart(str1, str2) {
        return str1.includes(str2) || str2.includes(str1);
    }

    function removeFirstTwoDigits(number) {
        if(number === undefined) return;
        return parseInt(number.toString().substring(2));
    }
    
      
    const maxWeight = 10000;

    function getBestVehicles(invoice) {
        if(invoice === undefined) return;
        let bestVehicles = [];
        let vehiclesInCity = [];
    
        const address = invoice.deliveryAddress;
        // console.log(address);
    
        const fliteredLocations = locationData.filter(location => {
            if(checkStringPart(location.city.toLowerCase(), address.toLowerCase())) {
                for (const value of Object.values(location)) {
                    console.log("VALUE IS:", value)
                    if (typeof(value) === "string" && checkStringPart(value.toLowerCase(), address.toLowerCase()) === true) {
                        return location;
                    }
                }
            }
        })

        console.log("FILTERED VEHICLES", fliteredLocations.map(location => {
            return {plate_no: `${location.plate_no}`, vehicle_code: `${location.vehicle_code}`}
        }))
    
        return fliteredLocations.map(location => {
            return {plate_no: `${location.plate_no}`, vehicle_code: `${location.vehicle_code}`}
        })
    
    }

    function getMatchedDrivers(bestVehicles) {
        let loggedDrivers: any[] = [];
        if (bestVehicles === undefined) return;
        bestVehicles.forEach(vehicle => {
          driverData.forEach(driver => {
            // console.log(`Vehicle plate no: ${vehicle.plate_no}\nDriver plate no: ${driver.plate_no}`);
            if (`${vehicle.plate_no}` === `${driver.plate_no}`) {
              loggedDrivers.push({
                plate_no: driver.plate_no,
                vehicle_code: removeFirstTwoDigits(driver.vehicle_code),
                firstDriver: driver.driver_1_name,
                secondDriver: driver.driver_2_name,
                thirdDriver: driver.driver_3_name,
                model: driver.model,
              });
            }
          });
        });
        console.log("Matched drivers are:", loggedDrivers);
        const matchedDrivers : any[] = [];
        const matchedVehicles : any[] = [];
        loggedDrivers.forEach(match => {
            matchedDrivers.push(match.firstDriver);
            matchedDrivers.push(match.secondDriver);
            matchedDrivers.push(match.thirdDriver);
            matchedVehicles.push(match.vehicle_code);
        })

        return {
            matchedDrivers: removeDuplicates(matchedDrivers).slice(0, 4),
            matchedVehicles: removeDuplicates(matchedVehicles).slice(0, 3)
        }
      }

      function removeDuplicates(arr) {
        return Array.from(new Set(arr));
      }




    function calculateProductsWeightAndVolume(delivery, invoices, items) {
        let totalProductsWeight = 0;
        let totalProductsVolume = 0;
        
        for (let i = 0; i < delivery.length; i++) {
            const invoiceNumber = delivery[i].invoiceNumber;
            const invoice = invoices.find(inv => inv.invoiceNumber === invoiceNumber);
        
            if (invoice) {
            const products = invoice.products;
        
            for (let j = 0; j < products.length; j++) {
                const productCode = products[j].productCode;
                const productQuantity = parseInt(products[j].productQuantity);
        
                const item = items.find(itm => itm.prodCode === productCode);
        
                if (item) {
                const unitWeight = parseFloat(item.unitWeight);
                totalProductsWeight += unitWeight * productQuantity;
        
                const uomDesc = item.UOM_DESC;
                const uomParts = uomDesc.split(" ");
                const uomQuantity = parseFloat(uomParts[0]);
                const uomUnit = uomParts[1].toUpperCase();
        
                if (uomUnit === "LTR") {
                    totalProductsVolume += uomQuantity * productQuantity;
                } else if (uomUnit !== "LTR") {
                    totalProductsVolume += (uomQuantity / 1000) * productQuantity;
                }
                }
            }
            }
        }
        
        return { totalProductsWeight, totalProductsVolume };
    }
      



      


    React.useEffect(() => {
        const bestVehicles = getBestVehicles(confirmedInvoices[0]);
        const matches : any = getMatchedDrivers(bestVehicles);
        if(matches === undefined) return;
        setMatchedDrivers(matches?.matchedDrivers);
        setMatchedVehicles(matches?.matchedVehicles);
        
        setRoutes(confirmedInvoices.filter((invoice) => {
            return invoice.deliveryAddress.length > 0
        }).map((invoice, index) => ({
            id: index + 1,
            customer: invoice.customerName,
            address: invoice.deliveryAddress,
            invoiceNumber: invoice.invoiceNumber,
        }))) 
        console.log("ROUTES:", confirmedInvoices.filter((invoice) => {
            return invoice.deliveryAddress.length > 0
        }).map((invoice, index) => ({
            id: index + 1,
            customer: invoice.customerName,
            address: invoice.deliveryAddress,
            invoiceNumber: invoice.invoiceNumber,
        })))
        console.log("CONFIRMED INVOICES:", confirmedInvoices);

        const { totalProductsWeight, totalProductsVolume } = calculateProductsWeightAndVolume(confirmedInvoices, invoices, items);
        console.log("TotalProductsWeight:", totalProductsWeight);
        setProductsWeight(totalProductsWeight);
        console.log("TotalProductsVolume:", totalProductsVolume);
        setProductsVolume(totalProductsVolume);
    }, [confirmedInvoices])


    const form = (
        <div
            style={{
                padding: '1rem',
                display: 'grid',
                placeItems: 'center',
                height: 'auto',
                overflow: 'auto',
                width: '100vw',
            }}
        >
            {/* <label htmlFor="zoom">Zoom</label>
            <input
                type="number"
                id="zoom"
                name="zoom"
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
            />
            <br />
            <label htmlFor="lat">Latitude</label>
            <input
                type="number"
                id="lat"
                name="lat"
                value={center.lat}
                onChange={(event) =>
                    setCenter({ ...center, lat: Number(event.target.value) })
                }
            />
            <br />
            <label htmlFor="lng">Longitude</label>
            <input
                type="number"
                id="lng"
                name="lng"
                value={center.lng}
                onChange={(event) =>
                    setCenter({ ...center, lng: Number(event.target.value) })
                }
            />
            <h3 style={{textAlign:'center'}}>
                {clicks.length === 0 ? 'Click on map to add markers' : 'Clicks'}
            </h3>
            {clicks.map((latLng, i) => (
                <pre key={i}>{JSON.stringify(latLng.toJSON(), null, 2)}</pre>
            ))}
            <button onClick={() => setClicks([])}>Clear</button> */}
            {/* <div className="" style={{ paddingTop: '4vh' }}>
                <Button variant="outlined" onClick={(e) => handleClick(e)}>
                    Create delivery
                </Button>
            </div> */}

            <div
            // style={{
            //     padding: '20px',
            //     display: 'flex',
            //     flexDirection: 'column',
            //     alignItems: 'center',
            //     justifyItems: 'center',
            //     justifyContent: 'center',
            // }}
            >
                <h1 style={{ textAlign: 'center', paddingBottom: '4vh' }}>
                    Delivery Confirmation
                </h1>

                <div className="">
                    <br />

                    <h3 style={{ paddingLeft: '360px' }}>Invoices</h3>
                    <div
                        className=""
                        style={{
                            position: 'absolute',
                            top: '100px',
                            left: '50px',
                        }}
                    >
                        <h3 style={{ fontWeight: 'normal' }}>
                            Confirm the invoices to be included in this
                            delivery:
                        </h3>
                        <br/>
                    </div>
                    <TransferList setConfirmedInvoices={setConfirmedInvoices} setInvoices={setInvoices} />
                </div>
                {/* {productsWeight > 0 && (
                    <div>
                        <h3>Product weight: {productsWeight} Kg /{maxWeight} Kg</h3>
                        <h3></h3>
                    </div>
                )} */}
                <br />
                <br />
                <br />
                <br />
                <Grid
                    container
                    alignItems="center"
                    justifyContent="center"
                    style={{ paddingLeft: '200px' }}
                >
                    <br />
                    <Grid item xs={6} style={{ padding: '2vh 0 4vh 2vh' }}>
                        <div
                            className=""
                            style={{
                                position: 'absolute',
                                top: '530px',
                                left: '50px',
                            }}
                        >
                            <h3 style={{ fontWeight: 'normal' }}>
                                Confirm the Driver and Vehicle to be assigned to this
                                delivery:
                            </h3>
                        </div>
                        <h3>Confirm Driver</h3>
                        <FormControl sx={{ marginTop: 1, minWidth: 120 }}>
                            <InputLabel htmlFor="grouped-native-select">
                                Driver
                            </InputLabel>
                            <Select
                                native
                                defaultValue="Ilyas Ahmad"
                                id="grouped-native-select"
                                label="Driver"
                            >

                                {matchedDrivers.map((driver, index) => {
                                    return (
                                        <option key={index} value={driver}>
                                            {driver}
                                        </option>
                                    );
                                })
                                }
                                {/* <optgroup label="Prefered">
                                <option value={3}>Waqas Ali</option>
                                    <option value={1}>Ilyas Ahmad</option>
                                    <option value={2}>Rajab Ali</option>
                                
                                </optgroup>
                                <optgroup label="Others">
                                    <option value={3}>Nisar Ali</option>
                                    <option value={4}>Sher Shah</option>
                                </optgroup> */}
                            </Select>
                        </FormControl>
                    </Grid>
            
                    <Grid item xs={6} style={{ padding: '2vh 0 4vh 6vh' }}>
                        <h3>Confirm Vehicle</h3>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel htmlFor="grouped-native-select">
                                Vehicle
                            </InputLabel>

                            <Select
                                native
                                defaultValue="Ford"
                                id="grouped-native-select"
                                label="Grouping"
                            >
                                {matchedVehicles.map((vehicle, index) => {
                                    return (
                                        <option key={index} value={vehicle}>
                                            {vehicle}
                                        </option>
                                    );
                                })
                                }
                                {/* <optgroup label="Prefered Vehicles">
                                <option value={3}>309</option>
                                    <option value={1}>311</option>
                                    <option value={2}>58</option>
                                    
                                </optgroup>
                                <optgroup label="Others">
                                    <option value={3}>349</option>
                                    <option value={4}>365</option>
                                </optgroup> */}
                            </Select>
                        </FormControl>
                    </Grid>
                    <br />
                    <br />
                    <div
                            className=""
                            style={{
                                position: 'absolute',
                                top: '710px',
                                left: '50px',
                            }}
                        >
                            <h3 style={{ fontWeight: 'normal', paddingBottom:"2vh" }}>
                                Confirm the Date and Time of this
                                delivery:
                            </h3>
                        </div>
                        <br />
                        <br />
                        <br />
                        <br />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid
                            container
                            sx={{ width: '100%', paddingBottom: '4vh', paddingTop:"4vh" }}
                        >
                            <Grid item xs={6}>
                                <DatePicker
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    renderInput={(props) => (
                                        <TextField
                                            {...props}
                                            variant="standard"
                                            id="mui-pickers-date"
                                            label="Delivery Date"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TimePicker
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    renderInput={(props) => (
                                        <TextField
                                            {...props}
                                            variant="standard"
                                            id="mui-pickers-date"
                                            label="Delivery Time"
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </LocalizationProvider>
                    <br />
                    <br />
                    <br />
                    <br />
                    <Grid item xs={12} style={{ padding: '0vh 0 2vh 2vh', marginTop: '30px' }}>
                    <div
                            className=""
                            style={{
                                position: 'absolute',
                                top: '820px',
                                left: '50px',
                            }}
                        >
                            <h3 style={{ fontWeight: 'normal', paddingBottom:"2vh" }}>
                                Confirm the order of this
                                delivery:
                            </h3>
                        </div>
                        <h3>View Route</h3>
                        {confirmedInvoices.length > 0 && (
                            <DraggableList width={500} height={50} rowSize={1}>
                                {confirmedInvoices.map((invoice, index) => ({
                                    id: index + 1,
                                    customer: invoice.customerName,
                                    address: invoice.deliveryAddress,
                                    invoiceNumber: invoice.invoiceNumber,
                                })).map((item, index) => (
                                    <li style={{ cursor: 'pointer' }} key={index}>
                                
                                    
                                        {item.address}

                                        <span style={{marginRight:"10px"}}></span>
                                        

                                        {item.invoiceNumber}
                                        <span style={{marginRight:"10px"}}></span>
                                        
                                        {item.customer}
                                    </li>
                                ))}
                            </DraggableList>
                        )}
                    </Grid>
                    <Button
                        size="small"
                        variant="contained"
                        style={{
                            backgroundColor: '#240AED',
                            color: 'white',
                            fontWeight: 'bolder',
                            border: '2px solid #240AED',
                        }}
                        onClick={(e) => {
                            let element: HTMLElement =
                                document.getElementsByClassName(
                                    'button button-primary'
                                )[0] as HTMLElement
                            element.click()
                            console.log('clicked')
                            window.scrollBy(0, -2000)
                        }}
                    >
                        Confirm Delivery
                    </Button>
                </Grid>
            </div>
        </div>
    )

    return (
        <>
            <div style={{ display: 'flex' }}>
                {/* <Wrapper
                apiKey="AIzaSyCGA-M9K1SQ0-rzaXVHzxmHOGIlrVmTwkg"
                render={render}
                libraries={['places']}
            >
                <Map
                    center={center}
                    onClick={onClick}
                    onIdle={onIdle}
                    zoom={zoom}
                    style={{ flexGrow: '.8', height: '100%' }}
                >
                    {clicks.map((latLng, i) => (
                        <Marker key={i} position={latLng} />
                    ))}
                </Map>
            </Wrapper> */}

                {/* Basic form for controlling center and zoom of map. */}
                {form}
            </div>
            <div>
                <RenderMap invoices={confirmedInvoices} />
            </div>
        </>
    )
}
interface MapProps extends google.maps.MapOptions {
    style: { [key: string]: string };
    onClick?: (e: google.maps.MapMouseEvent) => void;
    onIdle?: (map: google.maps.Map) => void;
    children?: React.ReactElement<google.maps.MarkerOptions>;
}

const Map: React.FC<MapProps> = ({
    onClick,
    onIdle,
    children,
    style,
    ...options
}) => {
    const ref = React.useRef<HTMLDivElement>(null)
    const [map, setMap] = React.useState<google.maps.Map>()

    React.useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}))
        }
    }, [ref, map])

    // because React does not do deep comparisons, a custom hook is used
    // see discussion in https://github.com/googlemaps/js-samples/issues/946
    useDeepCompareEffectForMaps(() => {
        if (map) {
            map.setOptions(options)
        }
    }, [map, options])

    React.useEffect(() => {
        if (map) {
            ;['click', 'idle'].forEach((eventName) =>
                google.maps.event.clearListeners(map, eventName)
            )

            if (onClick) {
                map.addListener('click', onClick)
            }

            if (onIdle) {
                map.addListener('idle', () => onIdle(map))
            }
        }
    }, [map, onClick, onIdle])

    return (
        <>
            <div ref={ref} style={style} />
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // set the map prop on the child component
                    return React.cloneElement(child, { map })
                }
            })}
        </>
    )
}

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
    const [marker, setMarker] = React.useState<google.maps.Marker>()

    React.useEffect(() => {
        if (!marker) {
            setMarker(new google.maps.Marker())
        }

        // remove marker from map on unmount
        return () => {
            if (marker) {
                marker.setMap(null)
            }
        }
    }, [marker])

    React.useEffect(() => {
        if (marker) {
            marker.setOptions(options)
        }
    }, [marker, options])

    return null
}

const deepCompareEqualsForMaps = createCustomEqual(
    (deepEqual) => (a: any, b: any) => {
        if (
            isLatLngLiteral(a) ||
            a instanceof google.maps.LatLng ||
            isLatLngLiteral(b) ||
            b instanceof google.maps.LatLng
        ) {
            return new google.maps.LatLng(a).equals(new google.maps.LatLng(b))
        }

        // TODO extend to other types

        // use fast-equals for other objects
        return deepEqual(a, b)
    }
)

function useDeepCompareMemoize(value: any) {
    const ref = React.useRef()

    if (!deepCompareEqualsForMaps(value, ref.current)) {
        ref.current = value
    }

    return ref.current
}

function useDeepCompareEffectForMaps(
    callback: React.EffectCallback,
    dependencies: any[]
) {
    React.useEffect(callback, [useDeepCompareMemoize, callback])
}

export default Asssignment
