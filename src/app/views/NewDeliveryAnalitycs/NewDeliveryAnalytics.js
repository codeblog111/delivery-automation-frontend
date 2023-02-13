import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { useTheme } from '@mui/material'

const NewDeliveryAnalitycs = () => {
    const { palette } = useTheme()

    const option = {
        grid: {
            left: '6%',
            bottom: '10%',
            right: '1%',
        },
        legend: {
            itemGap: 20,
            icon: 'circle',
            textStyle: {
                color: palette.text.secondary,
                fontSize: 13,
                fontFamily: 'roboto',
            },
        },
        color: [
            palette.primary.dark,
            palette.primary.light,
            palette.secondary.light,
            palette.error.light,
        ],
        barMaxWidth: '10px',
        tooltip: {},
        dataset: {
            source: [
                ['Weeks', 'Automotive', 'Powder Coating', 'Other'],
                ['Week 1', 0, 0, 0],
                ['Week 2', 0, 0, 0],
                ['Week 3', 0, 0, 0],
                ['Week 4', 0, 0, 0],
                ['Week 5', 0, 0, 0],
                ['Week 6', 0, 0, 0],
                ['Week 7', 0, 0, 0],
                ['Week 8', 0, 0, 0],
                ['Week 9', 0, 0, 0],
                ['Week 10', 0, 0, 0],
            ],
        },
        xAxis: {
            type: 'category',
            axisLine: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                color: palette.text.secondary,
                fontSize: 13,
                fontFamily: 'roboto',
            },
        },
        yAxis: {
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                // show: false
                lineStyle: {
                    color: palette.text.secondary,
                    opacity: 0.15,
                },
            },
            axisLabel: {
                color: palette.text.secondary,
                fontSize: 13,
                fontFamily: 'roboto',
            },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
            {
                type: 'bar',
                itemStyle: {
                    barBorderRadius: [10, 10, 0, 0],
                },
            },
            {
                type: 'bar',
                itemStyle: {
                    barBorderRadius: [10, 10, 0, 0],
                },
            },
            {
                type: 'bar',
                itemStyle: {
                    barBorderRadius: [10, 10, 0, 0],
                },
            },
        ],
    }

    return (
        <div
            style={{ paddingTop: '4vh', display: 'grid', placeItems: 'center' }}
        >
            <h1 style={{ textAlign: 'center', paddingBottom: '12vh' }}>
                Orders delivered by week
            </h1>
            <ReactEcharts
                style={{ height: '300px', width: '50vw' }}
                option={option}
            />
        </div>
    )
}

export default NewDeliveryAnalitycs
