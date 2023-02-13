import React from 'react'
import { Small } from 'app/components/Typography'

import { SimpleCard, MatxProgressBar } from 'app/components'
import { Box, styled, useTheme } from '@mui/system'
import { useNavigate } from 'react-router-dom'

const Campaigns = () => {
    const navigate = useNavigate()
    const theme = useTheme()
    const secondary = theme.palette.text.secondary
    const Title = styled('span')(() => ({
    fontSize: '1rem',
    fontWeight: '500',
    textTransform: 'capitalize',
}))
    

    return (
        <div>
            <div className="" style={{position:'absolute', right:60,marginTop:'20px'}}>
                <Title style={{cursor:'pointer', fontWeight:'normal', fontStyle:'italic'}} onClick={(e) => navigate('/deliveries')}>See All</Title>
                </div>
            <SimpleCard title="Ongoing Deliveries">
                
                
                <Small sx={{ color: secondary }}>Today</Small>
                <Box sx={{ pt: 1 }} />
                <MatxProgressBar
                    value={0}
                    color="primary"
                    text="Abu Dhabi (0)"
                />
                <Box sx={{ py: '4px' }} />
                <MatxProgressBar
                    value={0}
                    color="primary"
                    text="Al Ain (0)"
                />
                <Box sx={{ py: '4px' }} />
                <MatxProgressBar
                    value={0}
                    color="primary"
                    text="Ajman (0)"
                />
                 <MatxProgressBar
                    value={0}
                    color="primary"
                    text="Dubai (0)"
                />
                 <MatxProgressBar
                    value={0}
                    color="primary"
                    text="Fujairah (0)"
                />
                 <MatxProgressBar
                    value={0}
                    color="primary"
                    text="Ras Al Khaimah (0)"
                />
                 <MatxProgressBar
                    value={0}
                    color="primary"
                    text="Sharjah (0)"
                />

               
               
            </SimpleCard>
        </div>
    )
}

export default Campaigns
