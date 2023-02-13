import React from 'react'
import { Grid, Card, Icon, IconButton, Tooltip } from '@mui/material'
import { Box, styled } from '@mui/system'
// import { lighten } from '@mui/system'
import { Small } from 'app/components/Typography'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom'

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px !important',
    background: theme.palette.background.paper,
    [theme.breakpoints.down('sm')]: {
        padding: '16px !important',
    },
}))

const ContentBox = styled('div')(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    '& small': {
        color: theme.palette.text.secondary,
    },
    '& .icon': {
        opacity: 0.6,
        fontSize: '44px',
        color: theme.palette.primary.main,
    },
}))

const Heading = styled('h6')(({ theme }) => ({
    margin: 0,
    marginTop: '4px',
    fontWeight: '500',
    fontSize: '14px',
    color: theme.palette.primary.main,
}))

const StatCards = () => {
    const navigate = useNavigate()
    //   const { palette } = useTheme()
    // const textError = palette.error.main
    // const bgError = lighten(palette.error.main, 0.85)
    return (
        <Grid container spacing={3} sx={{ mb: '24px' }}>
            <Grid item xs={12} md={6}>
                <StyledCard elevation={6}>
                    <ContentBox>
                        <Icon className="icon">group</Icon>
                        <Box ml="12px">
                            <Small>New Deliveries this week</Small>
                            <Heading>0</Heading>
                        </Box>
                    </ContentBox>
                    <Tooltip title="View Details" placement="top">
                        <IconButton onClick={(e) => navigate('/new-delivery-analytics')}>
                            <Icon>arrow_right_alt</Icon>
                        </IconButton>
                    </Tooltip>
                </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <StyledCard elevation={6}>
                    <ContentBox>
                        <Icon className="icon">check</Icon>
                        <Box ml="12px">
                            <Small sx={{ lineHeight: 1 }}>
                                Orders Delivered last week
                            </Small>
                            <Heading>0</Heading>
                            
                        </Box>
                    </ContentBox>
                    <Tooltip title="View Details" placement="top">
                        <IconButton>
                            <Icon onClick={(e) => navigate('/order-delivred-analytics')}>arrow_right_alt</Icon>
                        </IconButton>
                    </Tooltip>
                </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <StyledCard elevation={6}>
                    <ContentBox>
                        <Icon className="icon">store</Icon>
                        <Box ml="12px">
                            <Small>Deliveries returned last week</Small>
                            <Heading>0</Heading>
                        </Box>
                    </ContentBox>
                    <Tooltip title="View Details" placement="top">
                        <IconButton onClick={()=> navigate('/delivery-returned-analytics')}>
                            <Icon>arrow_right_alt</Icon>
                        </IconButton>
                    </Tooltip>
                </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <StyledCard elevation={6}>
                    <ContentBox>
                        <Icon className="icon"><AccessTimeIcon fontSize='large'style={{color:'red'}}/></Icon>
                        <Box ml="12px">
                            <Small >Pending Deliveries</Small>
                            <Heading  >0 Orders</Heading>
                        </Box>
                    </ContentBox>
                    
                </StyledCard>
            </Grid>
            <Grid item xs={12} md={12}>
                <StyledCard elevation={6} >
                    <ContentBox>
                        <Icon  className="icon"><AccessTimeIcon fontSize='large'style={{color:'red'}}/></Icon>
                        <Box ml="12px">
                            <Small style={{textAlign: 'center'}}  >Extra Deliveries</Small>
                      
                        </Box>
                    </ContentBox>
                    <Tooltip title="View Details" placement="top">
                        <IconButton onClick={(e) => navigate('/important')}>
                            <Icon>arrow_right_alt</Icon>
                        </IconButton>
                    </Tooltip>
                    
                </StyledCard>
            </Grid>
        </Grid>
    )
}

export default StatCards
