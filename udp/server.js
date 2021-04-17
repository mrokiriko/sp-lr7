const udp = require('dgram');

let server = udp.createSocket('udp4');

const port = 9001
const ip = 'localhost'


function error_occured(error) {
  console.log('произошла ошибка:')
  console.log(error)
  server.close()
}

server.on('error', function(error) {
    error_occured(error)
});

// пишется при получении пакета
server.on('message', function(message, info) {
    console.log('пришло сообщение')
    console.log(info.address + ':' + info.port + ': ' + message.toString() + ' (' + info.size + ' байтов)')

    let answer = 'спасибо, сообщение "' + message + '" получили, очень приятно'

    // отправляем ответ
    server.send(answer, info.port, ip, function(error) {
        if (error) {
            error_occured(error)
        } else {
            console.log('ответ был успешно отправлен')
        }
    });
});

// пишется когда сокет готов слушать
server.on('listening', function() {
    var address = server.address()
    var server_port = address.port
    var server_ip = address.address
    console.log('я родился : ^ )')
    console.log('я слушаю тебя по ' + server_ip + ':' + server_port)
});

server.on('close', function() {
  console.log('соединение было закрыто')
});

server.bind(port);
