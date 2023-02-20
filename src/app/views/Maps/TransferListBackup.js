import * as React from 'react'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import axiosInstance from '../../../axios'
import { Autocomplete, Stack, TextField } from '@mui/material'
// function not(a, b) {
//     return a.filter((value) => b.indexOf(value) === -1)
// }

// function intersection(a, b) {
//     return a.filter((value) => b.indexOf(value) !== -1)
// }

export default function TransferList({ setConfirmedInvoices, setInvoices }) {
    // const [checked, setChecked] = React.useState([])
    const [left, setLeft] = React.useState([])
    const [right, setRight] = React.useState([])

    const [arrLeft, setArrLeft] = React.useState([])
    const [arrLeftChecked, setArrLeftChecked] = React.useState([])
    const [arrRight, setArrRight] = React.useState([])
    const [arrRightChecked, setArrRightChecked] = React.useState([])

    const checkingLeft = (value) => {
        if (arrLeftChecked.find(obj => value._id === obj._id))
            setArrLeftChecked(arrLeftChecked.filter(obj => value._id !== obj._id))
        else setArrLeftChecked(arrLeftChecked.concat(value))
    }

    const checkingRight = (value) => {
        if (arrRightChecked.find(obj => value._id === obj._id))
            setArrRightChecked(arrRightChecked.filter(obj => value._id !== obj._id))
        else setArrRightChecked(arrRightChecked.concat(value))
    }

    const pushToRight = () => {
        arrLeftChecked.forEach((obj) => {
            const index = arrLeft.findIndex((o) => o._id === obj._id);
            if (index > -1) {
                setArrRight(prev => prev.concat(obj))
                // setRight(arrRight.concat(arrLeftChecked))
                setConfirmedInvoices(prev => prev.concat(obj))
                setArrLeft(prev => prev.filter(v => v !== obj))
                setArrLeftChecked(prev => prev.filter(v => v !== obj))
            }
        })

    }

    const pushToLeft = () => {
        arrRightChecked.forEach((obj) => {
            const index = arrRight.findIndex((o) => o._id === obj._id);
            if (index > -1) {
                setArrLeft(prev => prev.concat(obj))
                setArrRight(prev => prev.filter(v => v !== obj))
                setConfirmedInvoices(prev => prev.filter(v => v !== obj))
                setArrRightChecked(prev => prev.filter(v => v !== obj))
            }
        })
    }

    // const leftChecked = intersection(checked, left)
    // const rightChecked = intersection(checked, right)

    // const handleToggle = (value) => () => {
    //     const currentIndex = checked.indexOf(value)
    //     const newChecked = [...checked]

    //     if (currentIndex === -1) {
    //         newChecked.push(value)
    //     } else {
    //         newChecked.splice(currentIndex, 1)
    //     }

    //     setChecked(newChecked)
    // }

    const handleAllRight = () => {
        setArrRight(arrRight.concat(arrLeft))
        setArrLeft([])
        setRight(arrRight.concat(arrLeft))
        setConfirmedInvoices(arrRight.concat(arrLeft))
        setLeft([])
        setArrRightChecked([])
        setArrLeftChecked([])
    }

    // const handleCheckedRight = () => {
    //     setRight(right.concat(leftChecked))
    //     setLeft(not(left, leftChecked))
    //     setChecked(not(checked, leftChecked))
    // }

    // const handleCheckedLeft = () => {
    //     setLeft(left.concat(rightChecked))
    //     setRight(not(right, rightChecked))
    //     setChecked(not(checked, rightChecked))
    // }

    const handleAllLeft = () => {
        setArrLeft(arrLeft.concat(arrRight))
        setArrRight([])
        setLeft(arrLeft.concat(arrRight))
        setRight([])
        setConfirmedInvoices([])
        setArrRightChecked([])
        setArrLeftChecked([])
    }

    function isDateToday(dateString) {
        const date = new Date(dateString);
        const today = new Date();
      
        return date.getFullYear() === today.getFullYear() &&
               date.getMonth() === today.getMonth() &&
               date.getDate() === today.getDate();
    }
      

    const getInvoices = async () => {
        const res = await axiosInstance.get('/invoice/all?limit=1000')

        setInvoices(res.data.invoices);
        
        console.log("FIRST INVOICE IS:", res.data.invoices[0])

        const inv = res.data.invoices.filter((obj, pos, arr) => {
            return isDateToday(obj.soDeliveryDate);
        })
        setLeft(inv)
        setArrLeft(inv)
    }

    React.useEffect(() => {
        getInvoices()
    }, [])

    // const customList = (items, title) => (
    //     <Paper sx={{ width: 300, height: 230, overflow: 'auto' }}>

    //         <List dense component="div" role="list">
    //             <Stack spacing={2} sx={{ width: 250 }}>
    //                 <Autocomplete
    //                     id="free-solo-demo"
    //                     freeSolo
    //                     options={left.map((option) => option.invoiceNumber)}
    //                     renderInput={(params) => (
    //                         <TextField {...params} label="search..." />
    //                     )}
    //                 />
    //             </Stack>
    //             {items.map((invoice) => {
    //                 const labelId = `transfer-list-item-${invoice}-label`

    //                 return (
    //                     <>
    //                         <h2>{title}</h2>

    //                         <ListItem
    //                             key={invoice._id}
    //                             role="listitem"
    //                             button
    //                             onClick={handleToggle(invoice._id)}
    //                         >
    //                             <ListItemIcon>
    //                                 <Checkbox
    //                                     checked={
    //                                         checked.indexOf(invoice._id) !== -1
    //                                     }
    //                                     tabIndex={-1}
    //                                     disableRipple
    //                                     inputProps={{
    //                                         'aria-labelledby': labelId,
    //                                     }}
    //                                 />
    //                             </ListItemIcon>
    //                             <ListItemText
    //                                 id={labelId}
    //                                 primary={invoice.invoiceNumber}
    //                                 secondary={invoice.customerName}
    //                             />

    //                         </ListItem>
    //                     </>
    //                 )
    //             })}
    //             <ListItem />
    //         </List>
    //     </Paper>
    // )

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">


            <Grid item>
                <Paper sx={{ width: 300, height: 230, overflow: 'auto' }}>
                    <List dense component="div" role="list">
                        <Stack spacing={2} sx={{ width: 250 }}>
                            <Autocomplete
                                id="free-solo-demo"
                                freeSolo
                                options={arrLeft.map((option) => option.invoiceNumber)}
                                renderInput={(params) => (
                                    <TextField {...params} label="search..." />
                                )}
                            />
                        </Stack>
                        {arrLeft.map((invoice, index) => {
                            const labelId = `transfer-list-item-${invoice}-label`
                            return (
                                <ListItem
                                    key={index}
                                    role="listitem"
                                    onClick={() => checkingLeft(invoice)}
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            checked={
                                                arrLeftChecked.includes(invoice)
                                            }
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{
                                                'aria-labelledby': labelId,
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        id={labelId}
                                        primary={invoice.invoiceNumber}
                                        secondary={invoice.customerName}
                                    />
                                </ListItem>
                            )
                        })}
                        <ListItem />
                    </List>
                </Paper>
            </Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllRight}
                        disabled={arrLeft.length === 0}
                        aria-label="move all right"
                    >
                        ≫
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={pushToRight}
                        disabled={arrLeftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={pushToLeft}
                        disabled={arrRightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllLeft}
                        disabled={arrRight.length === 0}
                        aria-label="move all left"
                    >
                        ≪
                    </Button>
                </Grid>
            </Grid>
            <div
                className=""
                style={{
                    position: 'absolute',
                    top: '145px',
                    right: '430px',
                    zIndex: 0,
                }}
            >
                <h3 style={{ fontWeight: 'bold' }}>Confirmed</h3>
            </div>
            <Grid item>
                <div className="">
                    <Paper sx={{ width: 300, height: 230, overflow: 'auto' }}>
                        <List dense component="div" role="list">
                            <Stack spacing={2} sx={{ width: 250 }}>
                                <Autocomplete
                                    id="free-solo-demo"
                                    freeSolo
                                    options={arrRight.map((option) => option.invoiceNumber)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="search..." />
                                    )}
                                />
                            </Stack>
                            {arrRight.map((invoice, index) => {
                                const labelId = `transfer-list-item-${invoice}-label`
                                return (
                                    <ListItem
                                        key={index}
                                        role="listitem"
                                        onClick={() => checkingRight(invoice)}
                                    >
                                        <ListItemIcon>
                                            <Checkbox
                                                checked={
                                                    arrRightChecked.includes(invoice)
                                                }
                                                tabIndex={-1}
                                                disableRipple
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            id={labelId}
                                            primary={invoice.invoiceNumber}
                                            secondary={invoice.customerName}
                                        />
                                    </ListItem>
                                )
                            })}
                            <ListItem />
                        </List>
                    </Paper>
                </div>
            </Grid>
        </Grid>
    )
}
