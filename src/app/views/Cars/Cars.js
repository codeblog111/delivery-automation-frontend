import React from 'react'

import {
    IconButton,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Icon,
    TablePagination,
    Button,
    MenuItem,
    TextField,
    Popover,
} from '@mui/material'

import { Box, styled, useTheme } from '@mui/system'
import axiosInstance from '../../../axios'
import SearchBar from '../../utils/SearchBar'

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

const Cars = () => {
    //SearchBar
    const { search } = window.location
    const query = new URLSearchParams(search).get('s')
    const [searchQuery, setSearchQuery] = React.useState(query || '')

    const [submit, setSubmit] = React.useState(false)
    // Popover State
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [popover, setPopover] = React.useState(null)
    const handleClick = (event, id) => {
        setAnchorEl(event.currentTarget)
        setPopover(id)
    }

    const handleClose = (e, id) => {
        setAnchorEl(null)
        setPopover(null)
        updateCar(id, e)
    }

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined
    const [status, setStatus] = React.useState('')
    const handleChangeDeliveryStatus = (event, id) => {
        setStatus(event.target.value)
    }

    // End of Popover State

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
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [page, setPage] = React.useState(0)
    const [total, setTotal] = React.useState(0)

    const handleChangePage = async (event, newPage) => {
        setPage(newPage)
        const res = await axiosInstance.get(`/cars/all?limit=10&page=${newPage}`)
        if (res.data.result > cars.length) {
            setCars( [...cars, ...res.data.cars])

        }
   
        
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }
    const [cars, setCars] = React.useState([])
    const filterCar = (cars, query) => {
        if (!query) {
            return cars
        }

        return cars.filter((car) => {
            
            var vehiculeCode = car.vehiculeCode.toLowerCase()
            var plateNumber = car.plateNumber.toLowerCase()

            return (
                vehiculeCode.includes(query) ||
                
                plateNumber.includes(query)
            )
        })
    }
    const filteredCars = filterCar(cars, searchQuery)
  

    React.useEffect(() => {
        const getCars = async () => {
            const res = await axiosInstance.get(`/cars/all?limit=10&page=${page}`)
           
                setCars(res.data.cars)
                setTotal(res.data.result)
            
            
        }
        getCars()
    }, [submit])

    const updateCar = async (e, id) => {
        try {
           
            await axiosInstance.put(`/cars/${id}`, {
                carStatus: status,
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
                List of Vehicles
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
                        <TableCell align="center">Vehicle ID</TableCell>
                        <TableCell align="center" colSpan={2}>Vehicle</TableCell>
                        <TableCell align="center">Plate Number</TableCell>
                        <TableCell align="center">Driver 1</TableCell>
                        <TableCell align="center">Driver 2</TableCell>
                        <TableCell align="center">Driver 3</TableCell>
                        <TableCell align="center" >Workability</TableCell>
                        <TableCell align="center">Status</TableCell>

                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredCars
                        .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                        )
                        .map((subscriber, index) => (
                            <TableRow key={index}>
                                <TableCell align="center" >
                                    {subscriber.vehiculeCode}
                                </TableCell>
                                <TableCell align="center"  colSpan={2}>
                                    {subscriber.model}
                                </TableCell>
                                <TableCell align="center" >
                                    {subscriber.plateNumber}
                                </TableCell>
                                <TableCell align="center" >
                                    {' '}
                                    {subscriber.driver1 != null ? subscriber.driver1.driverName : ''}{' '}
                                </TableCell>
                                <TableCell align="center">{subscriber.driver2 != null ? subscriber.driver2.driverName :''}</TableCell>{' '}
                                <TableCell align="center">{subscriber.driver3 != null ? subscriber.driver3.driverName :''} </TableCell>{' '}
                                <TableCell align="center"  >{subscriber.workability} </TableCell>{' '}
                                <TableCell align="center" sx={{ px: 0 }}>
                                    {subscriber.carStatus === 'unavailable' ? (
                                        <Small bgcolor={bgSecondary}>
                                            {subscriber.carStatus}
                                        </Small>
                                    ) : subscriber.carStatus === 'available' ? (
                                        <Small bgcolor={bgPrimary}>
                                            {subscriber.carStatus}
                                        </Small>
                                    ) : (
                                        <Small bgcolor={bgError}>
                                            {subscriber.carStatus}
                                        </Small>
                                    )}
                                </TableCell>{' '}
                                <TableCell align="center">
                                    <IconButton
                                        onClick={(e) =>
                                            handleClick(e, subscriber._id)
                                        }
                                    >
                                        <Icon color="">edit</Icon>
                                    </IconButton>
                                    <Popover
                                        id={id}
                                        open={popover === subscriber._id}
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
                                                    key="available"
                                                    value="available"
                                                >
                                                    Available
                                                </MenuItem>
                                                <MenuItem
                                                    key="unavailable"
                                                    value="unavailable"
                                                >
                                                    Unavailable
                                                </MenuItem>
                                                <MenuItem
                                                    key="Maintenance"
                                                    value="Maintenance"
                                                >
                                                    Maintenance
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
                                                    onClick={(e) => {
                                                        handleClose(
                                                            subscriber._id,
                                                            e
                                                        )
                                                    }}
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
                count={total}
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

export default Cars
