const socket = io()

socket.on('message', (msg) => {
    console.log(msg)
})

// Elements
const $messageForm = document.querySelector('.form-data')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#location-data')

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    $messageFormInput.setAttribute('disabled','disabled')
    $messageFormButton.setAttribute('disabled','disabled')
    const msg = e.target.elements.message.value

    socket.emit('message', msg, () => {
        $messageFormInput.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        $messageFormButton.removeAttribute('disabled')

        console.log('Message delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported in your browser.')
    } 
    
    $sendLocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!')
            $sendLocationButton.removeAttribute('disabled')
        })
    })
})