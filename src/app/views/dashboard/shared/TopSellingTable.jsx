import React, { useState, useEffect } from 'react'
import axiosInstance from '../../../../axios'
import { Paragraph } from 'app/components/Typography'
import { Box, styled } from '@mui/system'
import {
    Card,
    Icon,
    IconButton,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Popover,
    Button,
} from '@mui/material'
import { format } from 'date-fns/esm'
import { useNavigate } from 'react-router-dom'

const CardHeader = styled('div')(() => ({
    paddingLeft: '24px',
    paddingRight: '24px',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}))

const Title = styled('span')(() => ({
    fontSize: '1rem',
    fontWeight: '500',
    textTransform: 'capitalize',
}))

const ProductTable = styled(Table)(() => ({
    minWidth: 400,
    whiteSpace: 'pre',
    '& small': {
        height: 15,
        width: 50,
        borderRadius: 500,
        boxShadow:
            '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
    },
    '& td': {
        borderBottom: 'none',
    },
    '& td:first-of-type': {
        paddingLeft: '16px !important',
    },
}))

// const Small = styled('small')(({ bgcolor }) => ({
//     height: 15,
//     width: 50,
//     color: '#fff',
//     padding: '2px 8px',
//     borderRadius: '4px',
//     overflow: 'hidden',
//     background: bgcolor,
//     boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
// }))

const TopSellingTable = () => {
    // Popover State
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [anchorEl1, setAnchorEl1] = React.useState(null)
    const [popover, setPopover] = React.useState(null)
    const handleClick = (event, id) => {
        setAnchorEl(event.currentTarget)
        setPopover(id)
    }
    const handleClick1 = (event) => {
        setAnchorEl1(event.currentTarget)
        setOpen1(true)
    }

    const handleClose = () => {
        setAnchorEl(null)
        setPopover(null)
    }
    const handleClose1 = () => {
        setAnchorEl1(null)
        setOpen1(false)
    }

    const open = Boolean(anchorEl)
    const [open1, setOpen1] = React.useState(false)
    const id = open ? 'simple-popover' : undefined

    // End of Popover State

    const navigate = useNavigate()
    // const { palette } = useTheme()
    // const bgError = palette.error.main
    // const bgPrimary = palette.primary.main
    // const bgSecondary = palette.secondary.main
    const [deliveries, setDeliveries] = React.useState([])

    useEffect(() => {
        const getDeliveries = async () => {
            const res = await axiosInstance.get('/deliveries/all?limit=1000')

            setDeliveries(res.data.delivery)
        }
        getDeliveries()
    }, [])

    return (
        <Card elevation={3} sx={{ pt: '20px', mb: 3 }}>
            <CardHeader>
                <Title>Incoming Deliveries</Title>

                {/* <Select size="small" defaultValue="this_month">
                    <MenuItem value="this_month">This Month</MenuItem>
                    <MenuItem value="last_month">Last Month</MenuItem>
                </Select> */}

                <Title
                    style={{
                        cursor: 'pointer',
                        fontWeight: 'normal',
                        fontStyle: 'italic',
                    }}
                    onClick={(e) => navigate('/deliveries')}
                >
                    See All
                </Title>
            </CardHeader>
            <Box overflow="auto">
                <ProductTable>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ px: 3 }} colSpan={2}>
                                Delivery ID
                            </TableCell>

                            <TableCell sx={{ px: 0 }} colSpan={2}>
                                Emirate
                            </TableCell>
                            <TableCell sx={{ px: 0 }} colSpan={4}>
                                Creation Date
                            </TableCell>
                            <TableCell sx={{ px: 0 }} colSpan={1}>
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {deliveries.map((delivery, index) => (
                            <TableRow key={index} hover>
                                <TableCell
                                    colSpan={2}
                                    align="left"
                                    sx={{ px: 0, textTransform: 'capitalize' }}
                                >
                                    <Box display="flex" alignItems="center">
                                        <Paragraph sx={{ m: 0, ml: 4 }}>
                                            {index}
                                        </Paragraph>
                                    </Box>
                                </TableCell>

                                <TableCell
                                    sx={{ px: 0 }}
                                    align="left"
                                    colSpan={2}
                                >
                                    dubai
                                </TableCell>
                                <TableCell
                                    sx={{ px: 0 }}
                                    align="left"
                                    colSpan={4}
                                >
                                    {delivery.createdAt}
                                </TableCell>
                                <TableCell sx={{ px: 0 }} colSpan={1}>
                                    <IconButton
                                        onClick={(e) =>
                                            handleClick(e, delivery._id)
                                        }
                                    >
                                        <Icon color="primary">edit</Icon>
                                    </IconButton>
                                    <Popover
                                        id={id}
                                        open={popover === delivery._id}
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
                                                alignItems: 'center',
                                                flexDirection:"column"
                                            }}
                                        >
                                            <div className="">
                                                <p>
                                                    View Delivery id {index}
                                                   
                                                </p>
                                            </div>

                                            
                                       
                                        <div className="">
                                            <Button
                                                variant="contained"
                                                style={{
                                                    
                                                    fontWeight: 'bolder',
                                                
                                                }}
                                                onClick={(e) => {
                                                    navigate('/')
                                                }}
                                            >
                                                View on map
                                            </Button>
                                        </div>
                                        </div>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </ProductTable>
            </Box>
        </Card>
    )
}

const productList = [
    {
        // imgUrl: '/assets/images/products/headphone-2.jpg',
        name: 'Canter 2012',
        price: 'Fazal Mabood ',
        location: 'Dubai',
        available: 15,
    },
    {
        // imgUrl: '/assets/images/products/headphone-3.jpg',
        name: 'Canter 2013 White',
        price: 'Gulzar Ali',
        location: 'Abu Dhabi',
        available: 30,
    },
    {
        // imgUrl: '/assets/images/products/headphone-2.jpg',
        name: 'Canter 2012',
        price: 'Fazal Mabood ',
        location: 'Dubai',
        available: 't',
    },
    {
        // imgUrl: '/assets/images/products/headphone-3.jpg',
        name: 'Canter 2013 White',
        price: 'Gulzar Ali',
        location: 'Abu Dhabi',
        available: 30,
    },
    {
        // imgUrl: '/assets/images/products/headphone-2.jpg',
        name: 'Canter 2012',
        location: 'dubai',
        price: 'Fazal Mabood ',
        available: 15,
    },
    {
        // imgUrl: '/assets/images/products/headphone-3.jpg',
        name: 'Canter 2013 White',
        price: 'Gulzar Ali',
        location: 'Abu Dhabi',
    },
]

export default TopSellingTable
