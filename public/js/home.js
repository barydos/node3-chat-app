const socket = io()

// Elements
const $indexRooms = document.querySelector('#index-rooms')

// Templates
const indexRoomsTemplate = document.querySelector('#index-rooms-template').innerHTML

socket.on('load-rooms', ({ rooms }) => {
    const roomsMessage = (rooms.length === 0) ? "No active rooms" : "Existing rooms"
    const html = Mustache.render(indexRoomsTemplate, { roomsMessage, rooms })
    $indexRooms.innerHTML = html
})