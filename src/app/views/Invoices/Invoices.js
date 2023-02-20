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
    Button,
    Popover,
    Checkbox,
    InputBase,
    TextField,
    Select
} from '@mui/material'

import { Box, styled } from '@mui/system'

import 'react-accessible-shuttle/css/shuttle.css'
import TransferList from './TransferList'
import JoinInvoices from '../Maps/JoinInvoices'
import axiosInstance from '../../../axios'
import SearchBar from '../../utils/SearchBar'
import BasicTabs from './BasicTabs'
import FullScreenDialog from './FullScreenDialog'
import { useDispatch } from 'react-redux'

import items from "../Maps/DB/items.json";

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

const Invoices = () => {
    const dispatch = useDispatch();
    //SearchBar
    const { search } = window.location
    const query = new URLSearchParams(search).get('s')
    const [searchQuery, setSearchQuery] = React.useState(query || '')

    const [invoice, setInvoice] = React.useState({})
    const [invoices, setInvoices] = React.useState([])
    const onChangeInput = (e) => {
        const { name, value } = e.target
        setInvoice({ ...invoice, [name]: value })
    }
    // Popover State
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [anchorEl1, setAnchorEl1] = React.useState(null)
    const [popover, setPopover] = React.useState(null)
    const handleClick = (event, id,subscriber) => {
        dispatch({ type: "SET_CURRENT", payload: {subscriber}})
        setAnchorEl(event.currentTarget)
        setPopover(id)
    }
    const handleClose = () => {
        setAnchorEl(null)
        setPopover(null)
        setCurrent(current=>current+1)
    }
    const handleClick1 = (event) => {
        setAnchorEl1(event.currentTarget)
        setOpen1(true)
    }

   
    const handleClose1 = () => {
        setAnchorEl1(null)
        setOpen1(false)
    }



    const open = Boolean(anchorEl)
    const [open1, setOpen1] = React.useState(false)
    const id = open ? 'simple-popover' : undefined

    // End of Popover State

    // const bgError = palette.error.main
    // const bgPrimary = palette.primary.main
    // const bgSecondary = palette.secondary.main
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [page, setPage] = React.useState(0)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const filterInvoice = (invoices, query) => {
        if (!query) {
            return invoices
        }

        return invoices.filter((invoice) => {
            var invoiceNumber = invoice.invoiceNumber.toLowerCase()

            return invoiceNumber.includes(query) || invoice.customerName.toLowerCase().includes(query.toLowerCase())
        })
    }
    const filteredInvoices = filterInvoice(invoices, searchQuery)

    const [current,setCurrent] = React.useState(1);

    function findProductName(productCode, products) {
        // loop through the products array
        for (let i = 0; i < products.length; i++) {
          // check if the productCode of the current object matches the given productCode
          if (products[i].prodCode === productCode) {
            // return the productName if there is a match
            console.log("Match found for productCode: " + productCode + " productName: " + products[i].prodDesc)
            return products[i].prodDesc;
          }
        }
        // if no match is found, return null or a suitable default value
        console.log("No match found for productCode: " + productCode)
        return productCode;
      }
      


    

    useEffect(() => {
        const getInvoices = async () => {
            const res = await axiosInstance.get('/invoice/all?limit=1000')

            const inv = res.data.invoices.filter((obj, pos, arr) => {
                return (
                    arr
                        .map((mapObj) => mapObj.invoiceNumber)
                        .indexOf(obj.invoiceNumber) == pos
                )
            })

            console.log("INVOICES: ", inv);

            setInvoices(inv)
            dispatch({ type: "GET_INVOICES", payload:inv });
        }
        getInvoices()
    }, [])

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
                List of Invoices
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
            <div
                className=""
                style={{
                    position: 'absolute',
                    right: '60px',
                    paddingBottom: '4vh',
                    top: '120px',
                }}
            >
                {/* <h4
                    onClick={(e) => handleClick1(e)}
                    style={{ cursor: 'pointer' }}
                >
                    <Button variant="outlined">Join</Button>
                </h4> */}
            </div>
            <StyledTable
                onClick={() => {
                    handleClose1()
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={3}>Invoice Number</TableCell>
                        <TableCell colSpan={7}>Client Name</TableCell>
                        <TableCell colSpan={4}>Products</TableCell>
                        <TableCell colSpan={6}>Address</TableCell>
                        <TableCell colSpan={2}>Contact</TableCell>
                        <TableCell colSpan={2}>Date</TableCell>
                        <TableCell colSpan={2}>Split</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredInvoices
                        .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                        )
                        .map((subscriber, index) => {
                           
                      
                          return (  <TableRow key={index}>
                                <TableCell align="left" colSpan={3}>
                                    <Checkbox size="small" />
                                    {subscriber.invoiceNumber}
                                </TableCell>
                                <TableCell align="left" colSpan={7}>
                                    {subscriber.customerName}
                                </TableCell>
                                <TableCell align="left" colSpan={4}>
                                <Select
                                    native
                                    defaultValue=""
                                    id="grouped-native-select"
                                    sx={{
                                        width: '100%',
                                        maxWidth: '200px',
                                        maxHeight: '40px',
                                        borderRadius: '8px',
                                        backgroundColor: '#F8F8F8',
                                        '& .MuiSelect-outlined': {
                                          paddingTop: '10px',
                                          paddingBottom: '12px',
                                        },
                                        '& .MuiInputBase-input': {
                                          fontSize: '12px',
                                          fontWeight: 500,
                                          color: '#444444',
                                        },
                                        '& .MuiSvgIcon-root': {
                                          color: '#444444',
                                        },
                                        '@media (max-width: 600px)': {
                                          maxWidth: '100px',
                                        },
                                    }}
                                    MenuProps={{
                                        anchorOrigin: {
                                          vertical: 'bottom',
                                          horizontal: 'left',
                                        },
                                        transformOrigin: {
                                          vertical: 'top',
                                          horizontal: 'left',
                                        },
                                        getContentAnchorEl: null,
                                        sx: {
                                          borderRadius: '8px',
                                          backgroundColor: '#F8F8F8',
                                          '& .MuiMenuItem-root': {
                                            fontSize: '16px',
                                            fontWeight: 500,
                                            color: '#444444',
                                          },
                                          '& .MuiListItem-button:hover': {
                                            backgroundColor: '#EEEEEE',
                                          },
                                        },
                                      }}

                                >
                                    {subscriber.products.map((product, index) => {
                                        return (
                                            <option key={index} value={product}>
                                                {findProductName(product.productCode, items)}
                                            </option>
                                        )
                                    })
                                    }
                                </Select>
                                </TableCell>
                                <TableCell align="left" colSpan={6}>
                                    {subscriber.deliveryAddress}
                                </TableCell>
                                <TableCell align="left" colSpan={2}>
                                    {subscriber.deliveryContactNumber}
                                </TableCell>
                                <TableCell align="left" colSpan={2}>
                                    {subscriber.soDeliveryDate.slice(0, 10)}
                                </TableCell>

                                <TableCell colSpan={2}>
                                    <IconButton
                                        onClick={(e) => {
                                            handleClick(e, subscriber._id, subscriber)
                                            setInvoice(subscriber);
                                        }
                                        }
                                    >
                                        <Icon>edit</Icon>
                                    </IconButton>



                                    <Popover
                                        id={id}
                                        open={popover === subscriber._id}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorPosition={{
                                            top: 400,
                                            right: '50vw',
                                            left:0
                                        }}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'center',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <div>
                                           

                                            <FullScreenDialog 
                                                all={invoices}
                                                invoice={subscriber}
                                                />



                                              
                                            {/* <div
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
                                                        handleClose()
                                                    }
                                                >
                                                    Confirm
                                                </Button>
                                            </div> */}
                                        </div>
                                    </Popover>
                                    
                                   
{/* 
                                    <Popover
                                        id={id}
                                        open={popover === subscriber._id}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorPosition={{
                                            top: 400,
                                            right: '50vw',
                                        }}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'center',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <div
                                            style={{
                                                padding: '80px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <h3>
                                                Splitting invoice number{' '}
                                                {subscriber.invoiceNumber}
                                            </h3>
                                            <br />

                                            <TransferList
                                                all={invoices}
                                                invoice={subscriber}
                                                name={`Split ${current}`}
                                                
                                            />
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
                                                        handleClose()
                                                    }
                                                >
                                                    Confirm
                                                </Button>
                                            </div>
                                        </div>
                                    </Popover> */}
                                </TableCell>
                            </TableRow>
                        )})}
                </TableBody>
            </StyledTable>

            <Popover
                id={id}
                open={open1}
                anchorEl={anchorEl1}
                onClose={handleClose1}
                anchorPosition={{
                    top: 400,
                    right: 800,
                    left:0
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
                        padding: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <JoinInvoices all={invoices} />
                    <div className="" style={{ paddingTop: '10px' }}>
                        <Button
                            size="small"
                            variant="contained"
                            style={{
                                backgroundColor: '#240AED',
                                color: 'white',
                                fontWeight: 'bolder',
                                border: '2px solid #240AED',
                            }}
                            onClick={(e) => handleClose()}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </Popover>

            <TablePagination
                style={{ paddingRight: '4vw' }}
                sx={{ px: 2 }}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={invoices.length}
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

export default Invoices
