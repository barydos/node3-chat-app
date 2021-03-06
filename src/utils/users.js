const users = []

const addUser = (({id, username, room}) => {
    // Clean the data
    cleanUsername = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    // cleanRoom = room.trim().toLowerCase()

    // Validate the data
    if (!cleanUsername || !room) {
        return {
            error: "Username and room must be provided."
        }
    }

    const existingUser = users.find(user => user.username.trim().toLowerCase() === cleanUsername)
    if (existingUser) {
        return {
            error: "Username already in use."
        }
    }

    const user = { id, username, room }
    users.push( user )
    return { user }
})


const removeUser = (id) => {
    const userIndex = users.findIndex(user => user.id === id)
    
    if (userIndex !== -1) {
        return users.splice(userIndex,1)[0]
    }
}

const getUser = ((id) => {
    return users.find( user => user.id == id)
})

const getUsersInRoom = ((room) => {
    return users.filter((user) => user.room.toLowerCase() === room.toLowerCase())
})

const getRooms = () => {
    return [ ... new Set(users.map(user => user.room))]
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getRooms
}