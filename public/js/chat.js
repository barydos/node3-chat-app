const socket = io()

// Elements
const $messageForm = document.querySelector('.form-data')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#location-data')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

socket.on('message', (msg) => {
    const html = Mustache.render(messageTemplate, { createdAt: moment(msg.createdAt).format('hh:mm:ss A'), message: msg.text  })
    $messages.insertAdjacentHTML('beforeend', html)
    console.log(msg)
})

socket.on('locationMessage', (msg) => {
    const html = Mustache.render(locationMessageTemplate, { createdAt: moment(msg.createdAt).format('hh:mm:ss A'), url: msg.url })
    $messages.insertAdjacentHTML('beforeend', html)
})
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