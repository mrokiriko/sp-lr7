const readline = require('readline')
const udp = require('dgram')

let client = udp.createSocket('udp4');

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const port = 9001
const ip = 'localhost'


console.log('напишите сообщения по вкусу:')

rl.on('line', function (message) {

	// Отправка сообщения
	client.send(message, port, ip, function(error) {
		if (error) {
			client.close()
		} else {
			console.log('сообщение было успешно отправлено')
		}
	});

    rl.prompt(true)
})

// получаем ответ от сервера
client.on('message', function(message, info) {
	console.log('от сервера ' + info.address + ':' + info.port +' было получено сообщение: ' + message.toString() + ' (' + message.length + ' байтов)')
});
