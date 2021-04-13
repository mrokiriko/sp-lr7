const io = require('socket.io')

const server = io.listen(8000)

let user_list = [];

(async() => {

    console.log('сервер запущен :^)')

    server.on('connection', function (socket) {

        console.log('у нас новенький:', socket.id)

        socket.on('send', function (data) {

            let item = {
                'from': socket.id,
                'to': data.to,
                'msg': data.message,
            }

            console.log('передача сообщения:')
            console.log(item)

            socket.to(data.to).emit('message', item)

        })

        socket.on('publish_public_data', function (data) {

            console.log(socket.id, 'опубликовал свой socket.id')

            let info = {
                'socket_id': socket.id,
            }
            user_list.push(info)

            // обновить информацию о пользователях
            server.sockets.emit('public', user_list)
        })

        socket.on('disconnect', (reason) => {

            console.log('пользователь', socket.id, 'вышел')

            let new_user_list = []
            for (let i = 0; i < user_list.length; i++) {
                if (user_list[i].socket_id !== socket.id) {
                    new_user_list.push(user_list[i])
                }
            }
            user_list = new_user_list

            // обновить информацию о пользователях
            server.sockets.emit('public', user_list)
        })

    })
})();