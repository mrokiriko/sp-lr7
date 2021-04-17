const readline = require('readline'),
    io = require('socket.io-client')

let ioClient = io.connect('http://localhost:8000')
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

ioClient.emit('publish_public_data')
console.log('добро пожаловать. снова')

let session_keys = []

rl.on('line', function (msg) {
    for (let i = 0; i < session_keys.length; i++) {

        let user = session_keys[i]

        // не отправлять сообщение самому себе
        if (user.socket_id !== ioClient.id) {

            console.log('собщение было отправлено для', user.socket_id)

            ioClient.emit('send', {
                'to': user.socket_id,
                'message': msg,
            })
        }
    }

    rl.prompt(true)
})

ioClient.on('message', function (data) {

    for (let i = 0; i < session_keys.length; i++) {

        let user = session_keys[i]
        let user_socket_id = user.socket_id

        if (user_socket_id === data.from) {

            let message = data.msg

            console_out('было получено сообщение "' + message + '" от ' + data.from)
        }
    }
})

ioClient.on('public', function (data) {
    session_keys = data
    console_out('в комнате ' + session_keys.length + ' человек(а)')
})

function console_out(msg) {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    console.log(msg)
    rl.prompt(true)
}

