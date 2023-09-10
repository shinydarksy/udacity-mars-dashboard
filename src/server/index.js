require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = process.env.BACKEND_PORT || 3000
const API_KEY = process.env.BACKEND_PORT || 'DEMO_KEY'
const ROVER_ENDPOINT = process.env.ROVER_ENDPOINT ||'https://api.nasa.gov/mars-photos/api/v1'

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

app.get('/rovers/:rover_name', async (req, res) => {
    // This route gets the manifest data for a specific rover.

    const { rover_name } = req.params;

    try {
        // Get the rover name from the request parameters.
        const rover = await fetch(
            `${ROVER_ENDPOINT}/manifests/${rover_name}?api_key=${API_KEY}`
        )
            .then(res => res.json())
        // Send the manifest data back to the client.
        res.send(rover)
    } catch (err) {
        // Log the error to the console.
        console.log('error: ', err)
    }
})



app.get('/rover_photos/:rover_name', async (req, res) => {
    // This route gets the latest photos from a specific rover.

    try {
        // Get the rover name from the request parameters.
        const { rover_name } = req.params;

        // Make a request to the NASA API for the latest photos from the rover.
        let rover_photos = await fetch(
            `${ROVER_ENDPOINT}/rovers/${rover_name}/latest_photos?api_key=${API_KEY}
        `).then(res => res.json())
        // Send the photos back to the client.
        res.send(rover_photos)
    } catch (err) {
        // Log the error to the console.
        console.log('error: ', err)
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))