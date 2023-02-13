import React, { useEffect } from 'react'
import { initMap } from './TestMap'
import './style.css'

function RenderMap({ invoices }) {
    useEffect(() => {
        initMap(invoices)
    })

    return (
        <div id="container">
            <div id="map"></div>

            <div id="sidebar">
                <p>
                    Total Distance: <span id="total"></span>
                    Total Time: <span id="time"></span>
                </p>
                <div id="panel"></div>
            </div>
        </div>
    )
}

export default RenderMap
