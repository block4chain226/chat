const net = require('node:net')

let clients = []

let chatHistory = []

const server = net.createServer(socket => {
    socket.on('data', (chunk) => {
        if (clients.length !== 0) {
            chatHistory.push(chunk.toString())
            clients.map(client => {
                client.write(chunk.toString())
            })
        } else {
            console.log('clients is empty')
        }
    })
})

server.listen(8000, 'localhost').on('error', err => console.log(err))

//1
server.on('connection', (socket) => {
    console.log('someOne connected')
    const clientId = clients.length + 1
    socket.write(`id${clientId}`)
    userConnectNotification(clientId)
    clients.push(socket)
    if (chatHistory.length > 0) {
        //2
        let h = JSON.stringify(chatHistory)
        socket.write(h)
    }
    //send id to client and assign id to variable and then ask each time if id
    socket.on('end', () => {
        clients.map(client => {
            client.write(`user with id ${clientId} leaved chat`)
        })
    })
})

const userConnectNotification = (id) => {
    clients.map(client => {
        client.write(`user with id ${id} was connected to the server`)
    })
}

const userLeaveNotification = (id) => {
    clients.map(client => {
        client.write(`user with id ${id} leaved the server`)
    })
}