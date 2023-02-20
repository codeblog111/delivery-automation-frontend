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
    Button,
    MenuItem,
    Popover,
    TextField,
} from '@mui/material'

import { Box, styled } from '@mui/system'
import axiosInstance from '../../../axios'
import SearchBar from '../../utils/SearchBar'

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
    boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
}))
const Drivers = () => {
    //SearchBar
    const { search } = window.location
    const query = new URLSearchParams(search).get('s')
    const [searchQuery, setSearchQuery] = React.useState(query || '')

    // Popover State
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [popover, setPopover] = React.useState(null)
    const [status, setStatus] = React.useState('')
    const [drivers, setDrivers] = React.useState([])
    const handleChangeDeliveryStatus = (event) => {
        setStatus(event.target.value)
    }
    const handleClick = (event, id) => {
        setAnchorEl(event.currentTarget)
        setPopover(id)
    }

    const handleClose = (e,id) => {
        setAnchorEl(null)
        setPopover(null)
        updateDriver(id, e)
    }

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

    // End of Popover State
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [page, setPage] = React.useState(0)

    const handleChangePage =async  (event, newPage) => {
        setPage(newPage)
        const res = await axiosInstance.get(`/driver/all?limit=10&page=${newPage}`)
        if (res.data.result > drivers.length) {
            setDrivers( [...drivers, ...res.data.drivers])

        }
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }
    const { palette } = useTheme()
    const bgError = palette.error.main
    const bgPrimary = palette.primary.main
    const bgSecondary = palette.secondary.main


    const filterDriver = (drivers, query) => {
        if (!query) {
            return drivers
        }

        return drivers.filter((driver) => {
            var driverName = driver.driverName
            var driverNameLower = driver.driverName.toLowerCase()
            var driverCode = driver.driverCode.toLowerCase()

            return (
                driverNameLower.includes(query) ||
                driverName.includes(query) ||
                driverCode.includes(query)
            )
        })
    }
    const filteredDrivers = filterDriver(drivers, searchQuery)
    const [submit, setSubmit] = React.useState(false)
    const [total,setTotal] = React.useState(false)
   
    const updateDriver = async (e, id) => {
        try {
           
            await axiosInstance.put(`/driver/${id}`, {
                driverAvailability: status,
            })
            setSubmit(!submit)
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        const getDrivers = async () => {
            const res = await axiosInstance.get('/driver/all?limit=10')

            setDrivers(res.data.drivers)
            setTotal(res.data.result)
        }
        
            getDrivers()
        
        
    }, [submit])

   

    return (
        <Box
            width="100%"
            overflow="auto"
            style={{ paddingLeft: '6vw', paddingTop: '2vh' }}
        >
            <h1
                style={{
                    textAlign: 'center',
                    paddingRight: '6vw',
                }}
            >
                List of Drivers
            </h1>
            <div className="" style={{  paddingRight: '6vw'}}>
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    style={{
                        paddingTop: '2vh',
                        paddingBottom: '4vh',
                    }}
                />
            </div>
            <StyledTable>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Driver Code</TableCell>
                        <TableCell align="center">Driver</TableCell>
                        <TableCell align="center">Vehicle 1</TableCell>
                        <TableCell align="center">Vehicle 2</TableCell>
                        <TableCell align="center">Vehicle 3</TableCell>
                        <TableCell align="center">Workability</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredDrivers
                        .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                        )
                        .map((driver, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">
                                    {driver.driverCode}
                                </TableCell>
                                <TableCell align="center">
                                    {driver.driverName}
                                </TableCell>
                                
                                <TableCell align="center">
                                    {driver.car1 != null ? driver.car1.plateNumber : ''}
                                </TableCell>
                                <TableCell align="center">
                                    {driver.car2 != null ? driver.car2.plateNumber:''}
                                </TableCell>
                                <TableCell align="center">
                                    {driver.car3 != null ? driver.car3.plateNumber:''}
                                </TableCell>
                                <TableCell align="center">
                                    {driver.driverWorkability}
                                </TableCell>
                                <TableCell align="center">
                                    {driver.driverAvailability ===
                                    'Not Available' ? (
                                        <Small bgcolor={bgSecondary}>
                                            {driver.driverAvailability}
                                        </Small>
                                    ) : driver.driverAvailability ===
                                      'Available' ? (
                                        <Small bgcolor={bgPrimary}>
                                            {driver.driverAvailability}
                                        </Small>
                                    ) : (
                                        <Small bgcolor={bgError}>
                                            {driver.driverAvailability}
                                        </Small>
                                    )}
                                </TableCell>

                                <TableCell align="center">
                                    <IconButton
                                        onClick={(e) =>
                                            handleClick(e, driver._id)
                                        }
                                    >
                                        <Icon color="">edit</Icon>
                                    </IconButton>
                                    <Popover
                                        id={id}
                                        open={popover === driver._id}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorPosition={{
                                            top: 400,
                                            right: 800,
                                        }}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
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
                                                    value="Available"
                                                >
                                                    Available
                                                </MenuItem>
                                                <MenuItem
                                                    key="Not Available"
                                                    value="Not Available"
                                                >
                                                    Not Available
                                                </MenuItem>
                                                <MenuItem
                                                    key="On Leave"
                                                    value="On Leave"
                                                >
                                                    On Leave
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
                                                        handleClose( driver._id, e)
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

export default Drivers
