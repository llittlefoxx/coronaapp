var querystring = require('querystring');
const request = require('request');

globalThis.fetch = require('node-fetch').default; // uncomment in NodeJS environments
const Sms77Client = require('sms77-client'); // uncomment in NodeJS environments
const smsClient = new Sms77Client("x2hAPX6YY6HG6uBpe3ebBwvP5F6YnxVIHEfHhPEJSs3eobmXK6E5MxfcezKjYRvn")
let checkInterval;
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

const checkAppointments1 = () => {
    checkBalance();
    request({
        headers: {
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
            'Authorization': 'Basic OldXUVQtWU5XRC1CUFgy',
        },
        uri: 'https://229-iz.impfterminservice.de/rest/suche/impfterminsuche?plz=88367',
        method: 'GET'
    }, function (err, res, body) {
        //it works!node 
        console.log("Body-> s1" + res.body);
        console.log("ERR-> " + err);
        if (err === null && res.body !== "401 Unauthorized" && res.body.toString().length >= 0) {
            const result = JSON.parse(res.body);
            const termine = result.termine;
            const termineTSS = result.termineTSS;
            const praxen = result.praxen;
            if (termine.length !== 0 || termineTSS.length !== 0 || Object.keys(praxen).length !== 0) {
                sendSms("found an appointment something, " + termine.toString().substring(0, 150));
                clearInterval(checkInterval1);
            } else {
                console.log("No appointments yet");
            }
        } else {
            sendSms("Error happened");
            clearInterval(checkInterval1);
            console.log(err)
        }

    });
}

    const checkAppointments2 = () => {
        checkBalance();
        request({
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Authorization': 'Basic OldQODYtQk5aQy1SVURQ',
            },
            uri: 'https://002-iz.impfterminservice.de/rest/suche/impfterminsuche?plz=76287',
            method: 'GET'
        }, function (err, res, body) {
            //it works!node 
            console.log("Body-> s2 " + res.body);
            console.log("ERR-> " + err);
            if (err === null && res.body !== "401 Unauthorized" && res.body.toString().length >= 0) {
                const result = JSON.parse(res.body);
                const termine = result.termine;
                const termineTSS = result.termineTSS;
                const praxen = result.praxen;
                if (termine.length !== 0 || termineTSS.length !== 0 || Object.keys(praxen).length !== 0) {
                    sendSms("found an appointment something, " + termine.toString().substring(0, 150));
                    clearInterval(checkInterval2);
                } else {
                    console.log("No appointments yet");
                }
            } else {
                sendSms("Error happened");
                clearInterval(checkInterval2);
                console.log(err)
            }
    
        });

}
checkInterval1 = setInterval(checkAppointments1, 2500);
checkInterval2 = setInterval(checkAppointments2, 3000);
