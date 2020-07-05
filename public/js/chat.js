const socket = io()

socket.on('message', (msg) => {
    console.log(msg)
})

document.querySelector('.form-data').addEventListener('submit', (e) => {
    e.preventDefault()

    const msg = e.target.elements.message.value

    socket.emit('message', msg, () => {
        console.log('Message delivered!')
    })
})

document.querySelector('#location-data').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported in your browser.')
    } 

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!')
        })
    })
})