'use strict'

const token = process.env.FB_PAGE_ACCESS_TOKEN
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am Harambe\'s ghost.')
})

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function fibonacci(num) {
  if (num <= 1) return 1;

  return fibonacci(num - 1) + fibonacci(num - 2);
} 

function parseResponse(text) {
    let h = text.indexOf("how")
    let r = text.indexOf("r")
    let u = text.indexOf("u")
    if (h !== -1 && r !== -1 && u !== -1 && h < r && r < u) {
        return "not good"
    } else if (text.indexOf("y") !== -1) {
        return "because i'm dead"
    } else if (text.indexOf("meme") !== -1){
        return "the memes make me sad"
    } else if (text.indexOf("random") !== -1){
        return fibonacci(5)
    }else {
        return "sorry i don't understand"
    }
}

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = parseResponse(event.message.text)
            sendTextMessage(sender, text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
