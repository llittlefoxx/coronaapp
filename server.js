const querystring = require('querystring');
const request = require('request');
const globalThis = require('globalthis')();
globalThis.fetch = require('node-fetch').default;
const configuration = require('./config').config;
const smsApi = require('./smsApi');
const http = require('http');
const { JSON } = require('globalthis/implementation');
const { console } = require('globalthis/implementation');

const startDate = new Date().toDateString();
let foundAppointment = false;
let i = 0;

const checkCodes = () => {
    smsApi.checkBalance();
    configuration.plzs.forEach(plz => {
        console.log("Testing location -> ", plz)
        request({
            headers: configuration.requestHeaders,
            uri: configuration.apiBaseUrl + plz,
            method: 'GET'
        }, function (err, res, body) {

            if (typeof res !== 'undefined') {
                console.log("Body -> " + res.body);
                console.log("ERR -> " + err);
                if (err === null && res && res.body !== "401 Unauthorized" && res.body.toString().length >= 0) {
                    const result = JSON.parse(res.body);
                    const termine = result.termine;
                    const termineTSS = result.termineTSS;
                    const praxen = result.praxen;
                    if (termine.length !== 0 || termineTSS.length !== 0 || Object.keys(praxen).length !== 0) {
                        smsApi.sendSms("Termin in, PLZ: " + plz + " " + termine.toString().substring(0, 150));
                        foundAppointment = true;
                        clearInterval(checkinterval);
                    } else {
                        console.log("No appointments yet");
                    }
                } else {
                    smsApi.sendSms("Error happened");
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
    console.log(JSON.stringify(configuration))
    const server = http.createServer((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end("Requests made :" + i.toString() + " since " + startDate + " ////// Found somethis? " + (foundAppointment ? "YES!!!!" : "NOOOO"));
    });

    server.listen(configuration.port, configuration.hostname, () => {
        console.log(`Server running at http://${configuration.hostname}:${configuration.port}/`);
    });
    checkInterval = setInterval(cron, configuration.loopInterval);
} catch (error) {
    console.log("ERROR HAPPENED", error)
}

