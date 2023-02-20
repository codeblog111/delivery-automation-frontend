import * as React from 'react'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { useDispatch, useSelector } from 'react-redux'
import axiosInstance from '../../../axios'

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1)
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1)
}

function union(a, b) {
    return [...a, ...not(b, a)]
}

export default function TransferList(invoice) {
    const dispatch = useDispatch()

    const products = useSelector((state) => state.invoice.products)
    const splittedInvoice = useSelector(
        (state) => state.invoice.splittedInvoice
    )
    const splits = useSelector((state) => state.invoice.splits)

    const [checked, setChecked] = React.useState([])
    const [left, setLeft] = React.useState(products)

    const [right, setRight] = React.useState(splittedInvoice)

    const leftChecked = intersection(checked, left)
    const rightChecked = intersection(checked, right)

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value)
        const newChecked = [...checked]

        if (currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }

        setChecked(newChecked)
    }

    const numberOfChecked = (items) => intersection(checked, items).length

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items))
        } else {
            setChecked(union(checked, items))
        }
    }

    const handleCheckedRight = () => {
        setRight(prev => prev.concat(leftChecked))
        setLeft(prev => not(prev, leftChecked))
        setChecked(prev => not(prev, leftChecked))
        dispatch({ type: 'SELECTED', payload: right.concat(leftChecked) })
        setLeft((prev) =>
            prev.filter((x) => {
                return right.indexOf(x) < 0
            })
        )
    }

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked))
        setRight(not(right, rightChecked))
        setChecked(not(checked, rightChecked))
    }

    const handleIncrement = (p) => {
        if (p.productQuantity == 0) {
            let index = left.indexOf(p.left)
            left.splice(index, index)

            setLeft((left) => left)
        }

        let originalProduct = { ...p }
        let originalQuantity = 0
        var mainProductQ = p.productQuantity
        products.map((item) => {
            if (item.sNumber == p.sNumber) {
                originalQuantity += 1
                originalProduct.productQuantity = originalQuantity

                item.productQuantity -= 1
            }
        })
        console.log(products)
        dispatch({ type: 'INCREMENT', payload: products })

        setRight([...right, originalProduct])

        var occurence = right.reduce(function (result, current) {
            if (!result[current['productCode']]) {
                result[current['productCode']] = 0
            }
            result[current['productCode']]++
            return result
        }, {})

        ;[Object.values(occurence)].map((item) => {
            console.log(item)
        })
    }
    const handleDecrement = (p) => {
        console.log("PRODUCT IS:", p)
        let originalProduct = structuredClone(p)
        let originalQuantity = p.productQuantity
        products = products.map((item) => {
            console.log("ITEM IS:", item);
            if (item.productCode == p.productCode) {
                item.productQuantity = item.productQuantity - 1;
                return item;
            }
            return item;
        })

        console.log("RIGHT IS:", right[right.indexOf(p)])
        setLeft((prev) => [...prev, originalProduct])

        if(right[right.indexOf(p)] !== undefined) {
            right[right.indexOf(p)].productQuantity = right[right.indexOf(p)] - 1
        }

        // let result = findOcc(right, p.sNumber)
        // console.log(result)

        // if (result.length > 0) {
        //     let noDup = [...new Set(right)]
        //     noDup[0].productQuantity -= 1
        //     if (noDup[0].productQuantity == 0) {
        //         noDup.pop()
        //     }

        //     setRight(noDup)
        // }
    }

    function findOcc(arr, key) {
        let arr2 = []

        arr.forEach((x) => {
            // Checking if there is any object in arr2
            // which contains the key value
            if (
                arr2.some((val) => {
                    return val[key] == x[key]
                })
            ) {
                // If yes! then increase the occurrence by 1
                arr2.forEach((k) => {
                    if (k[key] === x[key]) {
                        k['occurrence']++
                    }
                })
            } else {
                // If not! Then create a new object initialize
                // it with the present iteration key's value and
                // set the occurrence to 1
                let a = {}
                a[key] = x[key]
                a['occurrence'] = 1
                arr2.push(a)
            }
        })

        return arr2
    }

    const [i, setI] = React.useState([])
    var occurence = left.reduce(function (result, current) {
        if (!result[current['productCode']]) {
            result[current['productCode']] = 0
        }
        result[current['productCode']]++
        return result
    }, {})

    React.useEffect(() => {
        var occurence = left.reduce(function (result, current) {
            if (!result[current['productCode']]) {
                result[current['productCode']] = 0
            }
            result[current['productCode']]++
            return result
        }, {})

        left.forEach((i, index) => {
            if (i.productQuantity == 0) {
                console.log('t')
                setLeft(left.splice(index, index))
            }
        })

        right.forEach((i, index) => {
            if (i.productQuantity == 0) {
                console.log('t')
                setRight(right.splice(index, index))
            }
        })

        // const getI = async () => {
        //     const res = await axiosInstance.get('/items/all?limit=100000')

        //     setI(res.data.Items)

        // }
        // getI()
    }, [dispatch, right, left, products, handleDecrement, handleIncrement])

    const customList = (title, items, key) => (
        <Card key={key}>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={
                            numberOfChecked(items) === items.length &&
                            items.length !== 0
                        }
                        indeterminate={
                            numberOfChecked(items) !== items.length &&
                            numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List
                sx={{
                    width: 200,
                    height: 230,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
                key={key}
            >
                {items.map((value, index) => {
                    const labelId = `transfer-list-all-item-${
                        value.sNumber + index + key
                    }-label`

                    return (
                        <ListItem
                            key={index}
                            role="listitem"
                            button
                        >
                            <ListItemIcon>
                                <Checkbox
                                    onClick={handleToggle(value)}
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                id={labelId}
                                primary={`${value.productCode}`}
                                secondary={
                                    <>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Button
                                                size="small"
                                                onClick={(e) =>
                                                    handleDecrement(value)
                                                }
                                            >
                                                -
                                            </Button>
                                            <div>{}</div>
                                            {`${parseInt(
                                                value.productQuantity
                                            )}`}
                                            <Button
                                                size="small"
                                                onClick={(e) =>
                                                    handleIncrement(value)
                                                }
                                            >
                                                +
                                            </Button>
                                        </div>
                                        <div style={{ paddingTop: '20px' }}>
                                            {value.productDescription}
                                        </div>
                                    </>
                                }
                            />
                        </ListItem>
                    )
                })}

                <ListItem />
            </List>
        </Card>
    )

    const customListLeft = (title, items) => (
        <Card>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={
                            numberOfChecked(items) === items.length &&
                            items.length !== 0
                        }
                        indeterminate={
                            numberOfChecked(items) !== items.length &&
                            numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List
                sx={{
                    width: 200,
                    height: 230,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value}-label`

                    return (
                        <ListItem
                            key={value}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                id={labelId}
                                primary={`${value.invoiceNumber}`}
                            />
                        </ListItem>
                    )
                })}
                <ListItem />
            </List>
        </Card>
    )

    return (
        <div>
            <Grid
                container
                spacing={6}
                justifyContent="center"
                alignItems="center"
            >
                <Grid item>{customList('Main Invoice', left)}</Grid>

                <Grid item>
                    <Grid container direction="column" alignItems="center">
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right"
                        >
                            &gt;
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                        >
                            &lt;
                        </Button>
                    </Grid>
                </Grid>

                <Grid item>
                    {customList(`Split ${invoice.index + 1} `, right)}
                </Grid>
            </Grid>
        </div>

        // <Grid container spacing={2} justifyContent="center" alignItems="center">
        //     <Grid item>{customList('Main Invoice', left)}</Grid>
        //     {new Array(invoice.invoice.splits)
        //                     .fill(0)
        //                     .map((i, index) => {
        //                         return (
        //                           <Grid item key={index}>
        //                           <Grid container direction="column" alignItems="center">
        //                               <Button
        //                                   sx={{ my: 0.5 }}
        //                                   variant="outlined"
        //                                   size="small"
        //                                   onClick={handleCheckedRight}
        //                                   disabled={leftChecked.length === 0}
        //                                   aria-label="move selected right"
        //                               >
        //                                   &gt;
        //                               </Button>
        //                               <Button
        //                                   sx={{ my: 0.5 }}
        //                                   variant="outlined"
        //                                   size="small"
        //                                   onClick={handleCheckedLeft}
        //                                   disabled={rightChecked.length === 0}
        //                                   aria-label="move selected left"
        //                               >
        //                                   &lt;
        //                               </Button>
        //                           </Grid>
        //                       </Grid>
        //                         )
        //                     })}

        //     <Grid item>{customList(invoice.name, right)}</Grid>
        // </Grid>
    )
}
