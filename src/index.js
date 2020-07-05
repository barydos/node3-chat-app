const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

// Setup App
const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Config
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')


app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection!')
    
    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('message',(msg, callback) => {
        io.emit('message', msg)
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('message', `https://www.google.com/maps?q=${coords.longitude},${coords.latitude}`)
        callback()
    })

    socket.on('disconnect', (msg) => {
        io.emit('message', 'A user has left!')
    })
})

server.listen(port, () => {
    console.log('Listening on port ' + port)
})