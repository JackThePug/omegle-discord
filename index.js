const Discord = require("discord.js")
const Omegle = require("omegle-node")

const bot = new Discord.Client()

const om = new Omegle()
const om1 = new Omegle()
const om2 = new Omegle()

const TOKEN = ""
const PREFIX = "^"

var session = false

var msession = false

var omchannel

var chatter 

om.on("recaptchaRequired", function(challenge) {
    message.channel.send(`ReCaptcha: ${challenge}`)
})

om.on("waiting", () => {     
    omchannel.send("Waiting for stranger")
})

om.on("connected", () => {
    omchannel.send("Connected")
})

om.on("gotMessage", function(msg) {
    omchannel.send(`Stranger: ${msg}`)
})

om.on("strangerDisconnected", () => {
    omchannel.send("Stranger Disconnected")
})

bot.on("ready", function(message) {
    console.log("Status >> Online")
})

om1.on("waiting", () => {
    omchannel.send("Om 1 >> Waiting")
})

om2.on("waiting", () => {
    omchannel.send("Om 2 >> Waiting")
})

om1.on("connected", () => {
    omchannel.send("Om 1 >> Connected")
})

om2.on("connected", () => {
    omchannel.send("Om 2 >> Connected")
})

om1.on("strangerDisconnected", () => {
    omchannel.send("Om 1 >> Disconnected, Ending session.")
    om1.disconnect()
    om2.disconnect()
})

om2.on("strangerDisconnected", () => {
    omchannel.send("Om 2 >> Disconnected, Ending session.")
    om1.disconnect()
    om2.disconnect()
})

om1.on("gotMessage", (msg1) => {
    omchannel.send(`Stranger 1: ${msg1}`)
    om2.send(msg1)
})

om2.on("gotMessage", (msg2) => {
    omchannel.send(`Stranger 2: ${msg2}`)
    om1.send(msg2)
})

bot.on("message", function(message) {
    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ")

    switch(args[0]) {

        case "start":
            session = true
            omchannel = message.channel
            om.connect()
            chatter = message.author
            break
        case "dc": 
            if (session == true && message.author == chatter) {
                om.disconnect()
                message.channel.send("Disconnected")
            }
            break

        case "help":
            message.channel.send("Heres how you use this shit bot:\n^start - Starts a omegle session\n ^dc Disconnects you from the omegle session\n^discstart - Starts a session that allows multiple people to chat. Only the person who started the session can run ^dc on the session.\n^eavesdropper - Allows you to watch 2 people conversate like some 60 year old neckbeard.")
            break

        case "discstart":
            msession = true
            chatter = message.author
            omchannel = message.channel
            om.connect()
            break
        
        case "eavesdropper":
            omchannel = message.channel
            om1.connect()
            om2.connect()
            break
    }

})

bot.on("message", (omsg) => {
    if (session == true) {
        if (omsg.author == chatter) {
            om.send(omsg.content)
        }
    }
})

bot.on("message", (mmsg) => {
    if (msession == true) {
        om.send(`${mmsg.author.username}: ${mmsg.content}`)
    }
})

bot.login(TOKEN)