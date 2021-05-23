var querystring = require('querystring');
const request = require('request');
var globalThis = require('globalthis')();
globalThis.fetch = require('node-fetch').default;
const Sms77Client = require('sms77-client');
const smsClient = new Sms77Client("x2hAPX6YY6HG6uBpe3ebBwvP5F6YnxVIHEfHhPEJSs3eobmXK6E5MxfcezKjYRvn")
const http = require('http');

const startDate = new Date().toDateString();;
const hostname = '0.0.0.0';
const port = 8080;

let foundAppointment = false;
let i = 0;
const plzs = [68163,
    69123,
    69124,
    69469,
    70174,
    70376,
    70629,
    71065,
    71297,
    71334,
    71636,
    72072,
    72213,
    72280,
    72469,
    72762,
    73037,
    73430,
    73730,
    74081,
    74360,
    74549,
    74585,
    74613,
    74821,
    74889,
    75056,
    75175,
    76137,
    76287,
    76530,
    76646,
    77656,
    77815,
    77933,
    78056,
    78224,
    78532,
    78628,
    79341,
    79379,
    79541,
    79761,
    88045,
    88212,
    88367,
    88444,
    89073,
    89522,
    89584,
    97980];

const sendSms = (smsText) => {
    return smsClient.sms({ from: "myCoronaApp", to: "004917635260384", text: smsText }).then(response => console.log(response)).catch(console.error);
}

const checkBalance = () => {
    smsClient.balance().then((balance) => {
        console.log(balance);
        if (balance <= (0.075 * 2)) {
            sendSms("Charji el compte")
        } else {
            console.log("Balance still good")
        }
    }).catch(console.error);
}

const checkCodes = () => {
    checkBalance();
    plzs.forEach(plz => {
        let url = "https://002-iz.impfterminservice.de/rest/suche/impfterminsuche?plz=" + plz;
        console.log("Testing -> ", plz)
        request({
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Authorization': 'Basic OldQODYtQk5aQy1SVURQ',
            },
            uri: url,
            method: 'GET'
        }, function (err, res, body) {

            if (typeof res !== 'undefined') {
                console.log("Body-> s1" + res.body);
                console.log("ERR-> " + err);
                if (err === null && res && res.body !== "401 Unauthorized" && res.body.toString().length >= 0) {
                    const result = JSON.parse(res.body);
                    const termine = result.termine;
                    const termineTSS = result.termineTSS;
                    const praxen = result.praxen;
                    if (termine.length !== 0 || termineTSS.length !== 0 || Object.keys(praxen).length !== 0) {
                        sendSms("found an appointment something, " + termine.toString().substring(0, 150));
                        foundAppointment = true;
                        clearInterval(checkinterval);
                    } else {
                        console.log("No appointments yet");
                    }
                } else {
                    sendSms("Error happened");
                    clearInterval(checkinterval);
                    console.log(err)
                }
            }
        });
    })

}


const cron = () => {
    i++;
    checkCodes();
}

try {
    checkInterval = setInterval(cron, 6000);
} catch (error) {
    console.log("ERROR HAPPENED", error)
}

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end("requests made :" + i.toString() + " since " + startDate + " ////// Found somethis? " + (foundAppointment ? "YES!!!!" : "NOOOO"));
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});