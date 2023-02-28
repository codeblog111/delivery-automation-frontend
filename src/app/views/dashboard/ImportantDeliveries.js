import { Autocomplete, TextField } from '@mui/material'
import React, { useState, useEffect } from 'react'
import {
    IconButton,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Icon,
    TablePagination,
    useTheme,
    Button,
    MenuItem,
    Popover,
} from '@mui/material'

import { Box, styled } from '@mui/system'
import axiosInstance from '../../../axios'

function ImportantDeliveries() {
    const StyledTable = styled(Table)(({ theme }) => ({
        whiteSpace: 'pre',
        '& thead': {
            '& tr': {
                '& th': {
                    paddingcenter: 0,
                    paddingRight: 0,
                },
            },
        },
        '& tbody': {
            '& tr': {
                '& td': {
                    paddingcenter: 0,
                    textTransform: 'capitalize',
                },
            },
        },
    }))

    const Small = styled('small')(({ bgcolor }) => ({
        height: 15,
        width: 50,
        color: '#fff',
        padding: '2px 8px',
        borderRadius: '4px',
        overflow: 'hidden',
        background: bgcolor,
        boxShadow:
            '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
    }))

    const { palette } = useTheme()
    const bgError = palette.error.main
    const bgPrimary = palette.primary.main
    const bgSecondary = palette.secondary.main
    const [drivers, setDrivers] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [invoices, setInvoices] = useState([])
    const [inputValue, setInputValue] = React.useState('');
    const [inputValue2, setInputValue2] = React.useState('');
    const [inputValue3, setInputValue3] = React.useState('');
    const [reserved, setReserved] = useState([])
    const [submit, setSubmit] = React.useState(false)


    useEffect(() => {
        const getInvoices = async () => {
            const res = await axiosInstance.get('/invoice/all?limit=1000')

            const inv = res.data.invoices.filter(invoice => `${invoice.invoiceNumber}` === "" || `${invoice.invoiceNumber}` === "No Invoice")

            setReserved(inv);
        }
        getInvoices()
    }, [])

    // Popover State
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [popover, setPopover] = React.useState(null)
    const [status, setStatus] = React.useState('')
    const handleChangeDeliveryStatus = (event) => {
        setStatus(event.target.value)
    }
    const handleClick = (event, id) => {
        setAnchorEl(event.currentTarget)
        setPopover(id)
    }

    const handleClose = (e, id) => {
        setAnchorEl(null)
        setPopover(null)
        // updateDriver(id, e)
    }

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

    const onReserve = (invoiceNumber, driverName, vehicleCode, status) => {
        setReserved((reserved) => [
            ...reserved,
            {
                invoiceNumber: invoiceNumber,
                driverName: driverName,
                vehicleCode: vehicleCode,
                status: status,
            },
        ])
    }

    const updateDriver = async (e, id) => {
        try {
            await axiosInstance.put(`/driver/${id}`, {
                driverAvailability: status,
            })
            setSubmit(!submit)
        } catch (err) {
            alert(err.message)
        }
    }
    // End of Popover State
    useEffect(() => {
        const getDrivers = async () => {
            const res = await axiosInstance.get('/driver/all?limit=1000')

            setDrivers(res.data.drivers)
        }
        const getCars = async () => {
            const res = await axiosInstance.get('/cars/all?limit=1000')

            setVehicles(res.data.cars)
        }
        const getInvoices = async () => {
            const res = await axiosInstance.get('/invoice/all?limit=1000')

            setInvoices(res.data.invoices)
        }

        getDrivers()
        getCars()
        getInvoices()
    }, [submit, reserved])
    return (
        <div>
            <h1 style={{ textAlign: 'center', paddingBottom: '2vh', paddingTop:"2vh" }}>
                Extra Deliveries
            </h1>
            
            <div
                className="important__container"
                style={{
                    display: 'flex',
                    marginLeft: '2vw',
                    paddingBottom: '4vh',
                    justifyContent:"space-evenly"
                }}
            >
                <div style={{flex:".2"}} >
                <p>Assign the driver and vehicle for  the extra delivery</p>
                </div>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={["No Invoice", ...invoices.map((d) => d.invoiceNumber)]}
                    defaultValue="No Invoice"
                    sx={{ flex: '.2', marginRight: '20px' }}
                    renderInput={(params) => (
                        <TextField {...params} label="Invoices" />
                    )}
                    onInputChange={(event, newInputValue) => {
                        setInputValue3(newInputValue);
                      }}
                />
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={drivers.filter(d => d.driverName != null).map((d) => d.driverName)}
                    sx={{ flex: '.2', marginRight: '20px' }}
                    renderInput={(params) => (
                        <TextField {...params} label="Driver" />
                    )}
                    onInputChange={(event, newInputValue) => {
                        setInputValue2(newInputValue);
                      }}
                />
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={vehicles.filter(v => v.plateNumber != null).map((v) => v.plateNumber)}
                    sx={{ flex: '.2', marginRight: '20px' }}
                    renderInput={(params) => (
                        <TextField {...params} label="Vehicle" />
                    )}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                      }}
                />
                
                <Button
                    variant="contained"
                    sx={{ flex: '.1', marginRight: '20px', height:"50px" }}
                    onClick={(e) => onReserve(inputValue3, inputValue2, inputValue, 'reserved')}
                >
                    Reserve
                </Button>
            </div>
            <div>
                {' '}
                <StyledTable>
                    <TableHead>
                        <TableRow>
                        <TableCell align="center">Invoice Number</TableCell>
                            <TableCell align="center">Driver Name</TableCell>
                            <TableCell align="center">Vehicle Code</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reserved.map((i, index) => (
                            <TableRow key={index}>
                                 <TableCell align="center">
                                    {i.invoiceNumber}
                                </TableCell>
                                
                                <TableCell align="center">
                                    {i.driverName}
                                </TableCell>
                                <TableCell align="center">
                                    {i.vehicleCode}
                                </TableCell>

                                <TableCell align="center">
                                    {i.status === 'Not Available' ? (
                                        <Small bgcolor={bgSecondary}>
                                            {i.status}
                                        </Small>
                                    ) : i.status === 'Available' ? (
                                        <Small bgcolor={bgPrimary}>
                                            {i.status}
                                        </Small>
                                    ) : (
                                        <Small bgcolor={bgError}>
                                            {i.status}
                                        </Small>
                                    )}
                                </TableCell>

                                <TableCell align="center">
                                    <IconButton
                                        onClick={(e) =>
                                            setReserved((prevState) => (
                                                 [...prevState.slice(0,index), ...prevState.slice(index+1)]
                                              ))
                                        }
                                    >
                                        <Icon color="">close</Icon>
                                    </IconButton>
                                 
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </StyledTable>
            </div>
        </div>
    )
}

export default ImportantDeliveries
