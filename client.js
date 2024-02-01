const net = require('node:net')
const readline = require('node:readline/promises')

const rl = readline.createInterface({input: process.stdin, output: process.stdout})

function cleanLine(dir) {
    return new Promise((res, rej) => {
        process.stdout.clearLine(dir, () => res())
    })
}

function moveUp(dx, dy) {
    return new Promise((res, rej) => {
        process.stdout.moveCursor(dx, dy, () => res())
    })
}

let id = -1

//4
async function ask() {
    const message = await rl.question('write smth...')
    await moveUp(0, -1)
    await cleanLine(0)
    await moveUp(0, -1)
    await cleanLine(0)
    //5
    socket.write(JSON.stringify({clientId: id, data: message}))
}

const socket = net.createConnection({host: 'localhost', port: 8000}, async () => {
    ask()
})

socket.on('data', async (chunk) => {
    //3
    if (chunk.toString().substring(0, 2) === 'id') {
        if (chunk.toString().includes('[')) {
            const start = chunk.toString().indexOf('id')
            const end = chunk.toString().indexOf('[')
            id = chunk.toString().substring(start + 2, end)
        } else {
            const start = chunk.toString().indexOf('id')
            id = chunk.toString().substring(start + 2)
        }
        if (chunk.toString().includes('[')) {
            const startArray = chunk.toString().indexOf('[')
            const array = chunk.toString().substring(startArray)
            const stringiFFy = JSON.parse(array)
            stringiFFy.map(item => {
                const obj = JSON.parse(item)
                console.log(`userId${obj.clientId}: ${obj.data}`)
            })
        }
    } else if (chunk.toString().substring(0, 4) === 'user') {
        console.log(chunk.toString())
    } else {
        console.log()
        await moveUp(0, -1)
        await cleanLine(0)
        const chunkObj = JSON.parse(chunk)
        console.log(`userId${chunkObj.clientId}: ${chunkObj.data}`)
    }
    ask()
})

