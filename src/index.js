const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom, getRooms } = require('./utils/users')

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
    io.emit('load-rooms', { rooms: getRooms()})
    
    socket.on('join', (options, callback) => {
        const { user, error } = addUser({ id: socket.id, ...options})
        if (error) {
            return callback(error)
        }
        
        socket.join(user.room)
        socket.emit('message', generateMessage('admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        // console.log(getRooms())
        io.emit('load-rooms', { rooms: getRooms()})
    })

    socket.on('sendMessage',(msg, callback) => {
        const user = getUser(socket.id)
        if (!user) {
            return { error: "User cannot be found." }
        }
        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback("Profanity is not allowed.")
        }        

        io.to( user.room ).emit('message', generateMessage(user.username, msg)) 
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://www.google.com/maps?q=${coords.longitude},${coords.latitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        // console.log(user)
        if (user) {
            io.to(user.room).emit('message', generateMessage('admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
            socket.leave(user.room)
        }       
    })
})

server.listen(port, () => {
    console.log('Listening on port ' + port)
})