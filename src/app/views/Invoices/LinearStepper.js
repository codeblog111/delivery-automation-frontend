import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Grid, TextField } from '@mui/material'
import TransferList from './TransferList'
import TransferListResult0 from './TransferListResult0'
import TransferListResultSplit from './TransferListResultSplit'
import { useDispatch, useSelector } from 'react-redux'
import TransferListResultSplit2 from './TransferListResultSplit2'

export default function HorizontalLinearStepper(invoice) {
    const dispatch = useDispatch()
    const splittedInvoice = useSelector(
        (state) => state.invoice.splittedInvoice
    )
    const [splits, setSplits] = React.useState(2);

    const [invoiceName, setInvoiceName] = React.useState(invoice.invoice.invoice.invoiceNumber);

    React.useEffect(() => {
        console.log("PRODUCTS: ", invoice.products);
        console.log("INVOICE IS: ", invoice.invoice.invoice);
    }, []);

    const [isNextButtonDisabled, setIsNextButtonDisabled] = React.useState(false);
    const [finalSplitInvoices, setFinalSplitInvoices] = React.useState([]);

      

    const steps = [
        {
            title: 'Select numbers of splits',
            content: (
                <div style={{ paddingTop: '4vh' }}>
                    <h3>
                        In how many sections do you want to divide this invoice?{' '}
                    </h3>

                    <TextField
                        id="outlined-number"
                        label="Splits"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={splits}
                        onChange={(e) => {
                            setSplits(prev => {
                                if(prev <= 2 && e.target.value <= 2) {
                                    return 2
                                }
                                return e.target.value
                            })
                        }}
                    />
                </div>
            ),
        },
        {
            title: 'Split',
            content: (
                <div style={{ paddingTop: '4vh' }}>
                    <Grid container spacing={3}>
                        <Grid item>
                            <p style={{ fontSize: '13px' }}>You chose to split your main invoice into {splits} splits.{"\n"}
                            Click on the dropdown menu to choose which split invoice to move the products into.
                            </p>
                            <TransferList
                                invoice={invoice.invoice.invoice}
                                numberOfLeftInvoices={splits}
                                setIsNextButtonDisabled={setIsNextButtonDisabled}
                                setFinalSplitInvoices={setFinalSplitInvoices}
                            />
                        </Grid>
                    </Grid>
                </div>
            ),
        },
        {
            title: 'Preview',
            content: (
                <div style={{ paddingTop: '4vh' }}>
                    <Grid container spacing={3}>

                        <Grid item xs={6}>
                            <Grid container>
                                {finalSplitInvoices.map((invoice, index) => {
                                    return (
                                        <Grid item xs={5}>
                                            {/* <h3 style={{ textAlign: 'center' }}>
                                                {invoiceName}{getAlphabetLetter(index)}
                                            </h3> */}
                                            <TransferListResultSplit2
                                                invoice={invoice}
                                                invoiceNumber={invoiceName}
                                                indexKey={index}
                                            />
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            ),
        },
    ]

    const [activeStep, setActiveStep] = React.useState(0)
    const [skipped, setSkipped] = React.useState(new Set())

    const isStepOptional = (step) => {
        return step === 1
    }

    const isStepSkipped = (step) => {
        return skipped.has(step)
    }

    const handleNext = () => {
        let newSkipped = skipped
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values())
            newSkipped.delete(activeStep)
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1)
        setSkipped(newSkipped)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.")
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1)
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values())
            newSkipped.add(activeStep)
            return newSkipped
        })
    }

    const handleReset = () => {
        setActiveStep(0)
    }

    React.useEffect(() => {}, [splits, splittedInvoice, dispatch])

    return (
        <Box sx={{ width: '70vw' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                >
                    Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />

                <Button onClick={handleNext} disabled={isNextButtonDisabled}>
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Box>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps = {}
                    const labelProps = {}
                    // if (isStepOptional(index)) {
                    //     labelProps.optional = (
                    //         <Typography variant="caption">Optional</Typography>
                    //     )
                    // }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false
                    }
                    return (
                        <Step key={label.title + index} {...stepProps}>
                            <StepLabel {...labelProps}>{label.title}</StepLabel>
                        </Step>
                    )
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>{steps[activeStep].content}</React.Fragment>
            )}
        </Box>
    )
}
