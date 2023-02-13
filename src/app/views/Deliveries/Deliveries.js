import React, { useEffect } from 'react'

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
    Popover,
    MenuItem,
    TextField,
    Button,
} from '@mui/material'

import { Box, styled } from '@mui/system'

import { format } from 'date-fns'
import axiosInstance from '../../../axios'
import SearchBar from 'app/utils/SearchBar'

const StyledTable = styled(Table)(({ theme }) => ({
    whiteSpace: 'pre',
    '& thead': {
        '& tr': {
            '& th': {
                paddingLeft: 0,
                paddingRight: 0,
            },
        },
    },
    '& tbody': {
        '& tr': {
            '& td': {
                paddingLeft: 0,
                textTransform: 'capitalize',
            },
        },
    },
}))

const subscribarList = [
    {
        id: 1,
        name: 'Ilyas Ahmad',
        status: 'pending',
        location: 'Dubai',
        invoices: [
            {
                invoiceId: '123',
            },
            {
                invoiceId: '456',
            },
        ],
        delivery2: 'Rajab Ali',
        delivery3: 'Waqas Ali',
        vehicules: '82492',
    },
    {
        id: 2,
        name: 'Waqas Ali',
        status: 'returned',

        location: 'Dubai',
        invoices: [
            {
                invoiceId: '123456789',
            },
        ],
        delivery2: 'Rajab Ali',
        delivery3: 'Waqas Ali',
        vehicules: '82492',
    },
    {
        id: 3,
        name: 'Waqas Ali',
        status: 'delivered',
        location: 'Dubai',
        invoices: [
            {
                invoiceId: '123456789',
            },
        ],
        delivery2: 'Rajab Ali',
        delivery3: 'Waqas Ali',
        vehicules: '82492',
    },
    {
        id: 4,
        name: 'Guldad Khan',
        status: 'ongoing',

        location: 'Dubai',
        invoices: [
            {
                invoiceId: '123456789',
            },
        ],
        delivery2: 'Rajab Ali',
        delivery3: 'Waqas Ali',
        vehicules: '82492',
    },
    {
        id: 5,
        name: 'Rajab Ali',
        status: 'delivered',
        location: 'Dubai',
        invoices: [
            {
                invoiceId: '123456789',
            },
        ],
        delivery2: 'Rajab Ali',
        delivery3: 'Waqas Ali',
        vehicules: '82492',
    },
    {
        id: 6,
        name: 'Rajab Ali',
        status: 'returned',

        location: 'Dubai',
        invoices: [
            {
                invoiceId: '123456789',
            },
        ],
        delivery2: 'Rajab Ali',
        delivery3: 'Waqas Ali',
        vehicules: '82492',
    },
    {
        id: 7,
        name: 'Rajab Ali',
        status: 'delivered',
        location: 'Dubai',
        invoices: [
            {
                invoiceId: '123456789',
            },
            {
                invoiceId: '123456789',
            },
        ],
        delivery2: 'Rajab Ali',
        delivery3: 'Waqas Ali',
        vehicules: 'mitsubishi',
    },
    {
        id: 8,
        name: 'Rajab Ali',
        status: 'delivered',
        location: 'Dubai',
        invoices: [
            {
                invoiceId: '123456789',
            },
        ],
        delivery2: 'Rajab Ali',
        delivery3: 'Waqas Ali',
        vehicules: 'HINO',
    },
    {
        id: 9,
        name: 'Rajab Ali',
        status: 'delivered',
        location: 'Dubai',
        invoices: [
            {
                invoiceId: '123456789',
            },
        ],
        delivery2: 'Rajab Ali',
        delivery3: 'Waqas Ali',
        vehicules: '82492',
    },
]

const Deliveries = () => {
    // const navigate = useNavigate()
    const [deliveries, setDeliveries] = React.useState([])
    const [invoices, setInvoices] = React.useState([])
    const [submit, setSubmit] = React.useState(false)
    //SearchBar
    const { search } = window.location
    const query = new URLSearchParams(search).get('s')
    const [searchQuery, setSearchQuery] = React.useState(query || '')
    // Popover State
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [popover, setPopover] = React.useState(null)

    const handleClick = (event, id) => {
        setAnchorEl(event.currentTarget)
        setPopover(id)
    }

    const handleClose = (e,id) => {
        setAnchorEl(null)
        setPopover(null)
        updateDelivery(id,e)
    }

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined
    const [status, setStatus] = React.useState('')
    const handleChangeDeliveryStatus = (event) => {
        setStatus(event.target.value)
    }

    // End of Popover State

    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [page, setPage] = React.useState(0)

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
    // const bgPrimary = palette.primary.main
    const bgSecondary = palette.secondary.main

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const filterDelivery = (deliveries, query) => {
        if (!query) {
            return deliveries
        }

        return deliveries.filter((delivery) => {
            var deliveryName = delivery.deliveryName
            var deliveryNameLower = delivery.deliveryName.toLowerCase()
            var deliveryCode = delivery.deliveryCode.toLowerCase()

            return (
                deliveryNameLower.includes(query) ||
                deliveryName.includes(query) ||
                deliveryCode.includes(query)
            )
        })
    }
    const filteredDeliveries = filterDelivery(deliveries, searchQuery)

    const getDeliveries = async () => {
        const res = await axiosInstance.get('/deliveries/all?limit=1000')

        setDeliveries(res.data.delivery)
        console.log("Deliveries ARE:", res.data.delivery)
    }
    
    const getInvoices = async () => {
        const res = await axiosInstance.get('/invoice/all?limit=1000')
        const inv = res.data.invoices.filter((obj, pos, arr) => {
            return (
                arr
                    .map((mapObj) => mapObj.invoiceNumber)
                    .indexOf(obj.invoiceNumber) == pos
            )
        })

        setInvoices(inv)
    }

    useEffect(() => {
        getDeliveries();  
        getInvoices();

        return () => {
            getDeliveries();  
            getInvoices();
        } 
    }, [submit])

    const updateDelivery = async (e, id) => {
        try {
           
            await axiosInstance.put(`/deliveries/${id}`, {
                deliveryStatus: status,
            })
            setSubmit(!submit)
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <Box
            width="100%"
            overflow="auto"
            style={{ paddingLeft: '6vw', paddingTop: '2vh' }}
        >
            <h1
                style={{
                    textAlign: 'center',
                    paddingBottom: '2vh',
                    paddingRight: '6vw',
                }}
            >
                Summary of Deliveries
            </h1>
            <div className="" style={{ paddingRight: '6vw' }}>
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    style={{
                        paddingTop: '4vh',
                        paddingBottom: '4vh',
                    }}
                />
            </div>
            <StyledTable>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Delivery</TableCell>
                        <TableCell align="center">Invoice</TableCell>
                        <TableCell align="center">Vehicle</TableCell>
                        <TableCell align="center">Driver</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center" colSpan={2}>
                            Approval Date
                        </TableCell>
                        <TableCell align="center" colSpan={2}>
                            Departure Date
                        </TableCell>
                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredDeliveries
                        .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                        )
                        .map((subscriber, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">{index}</TableCell>
                                <TableCell align="center">
                                    {invoices.map((inv) => {
                                        return subscriber.invoices.map(
                                            (invoice) => {
                                                if (invoice == inv._id) {
                                                
                                                    return inv.invoiceNumber
                                                }
                                            }
                                        )
                                    })}
                                </TableCell>
                                <TableCell align="center">
                                    {subscriber.car.vehiculeCode}
                                </TableCell>
                                <TableCell align="center">
                                    {subscriber.driver.driverCode}
                                </TableCell>
                               
                                <TableCell sx={{ px: 0 }} align="center">
                                    {subscriber.deliveryStatus === 'ongoing' ? (
                                        <Small bgcolor={bgSecondary}>
                                            {subscriber.deliveryStatus}
                                        </Small>
                                    ) : subscriber.deliveryStatus ===
                                      'delivered' ? (
                                        <Small bgcolor={'#4BB543'}>
                                            Delivered
                                        </Small>
                                    ) : subscriber.deliveryStatus ===
                                      'pending' ? (
                                        <Small bgcolor={'gray'}>Pending</Small>
                                    ) : (
                                        <Small bgcolor={bgError}>
                                            Returned
                                        </Small>
                                    )}
                                </TableCell>{' '}
                                <TableCell align="center" colSpan={2}>
                                    {format(Date.now(), 'dd/MM/yyyy, hh:mm:ss')}
                                </TableCell>
                                <TableCell align="center" colSpan={2}>
                                    {format(Date.now(), 'dd/MM/yyyy, hh:mm:ss')}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        onClick={(e) =>
                                            handleClick(e, subscriber.id)
                                        }
                                    >
                                        <Icon color="">edit</Icon>
                                    </IconButton>
                                    <Popover
                                        id={id}
                                        open={popover === subscriber.id}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorPosition={{
                                            top: 400,
                                            right: 800,
                                        }}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'center',
                                            horizontal: 'center',
                                        }}
                                    >
                                        <div
                                            style={{
                                                padding: '20px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <p>Select the status:</p>
                                            <TextField
                                                id="outlined-select-currency"
                                                select
                                                label="Select"
                                                value={status}
                                                onChange={(e) =>
                                                    handleChangeDeliveryStatus(
                                                        e
                                                    )
                                                }
                                                helperText="Please select the new status"
                                            >
                                                <MenuItem
                                                    key="ongoing"
                                                    value="ongoing"
                                                >
                                                    Ongoing
                                                </MenuItem>
                                                <MenuItem
                                                    key="delivered"
                                                    value="delivered"
                                                >
                                                    Delivered
                                                </MenuItem>
                                                <MenuItem
                                                    key="returned"
                                                    value="returened"
                                                >
                                                    Returned
                                                </MenuItem>
                                                <MenuItem
                                                    key="pending"
                                                    value="pending"
                                                >
                                                    Pending
                                                </MenuItem>
                                            </TextField>
                                            <div
                                                className=""
                                                style={{ paddingTop: '10px' }}
                                            >
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    style={{
                                                        backgroundColor:
                                                            '#240AED',
                                                        color: 'white',
                                                        fontWeight: 'bolder',
                                                        border: '2px solid #240AED',
                                                    }}
                                                    onClick={(e) =>
                                                        handleClose(
                                                            subscriber._id,
                                                            e
                                                        )
                                                    }
                                                >
                                                    Confirm
                                                </Button>
                                            </div>
                                        </div>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </StyledTable>

            <TablePagination
                style={{ paddingRight: '4vw' }}
                sx={{ px: 2 }}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={subscribarList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                    'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                    'aria-label': 'Next Page',
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    )
}

export default Deliveries
