var querystring = require('querystring');
const request = require('request');
var globalThis = require('globalthis')();
globalThis.fetch = require('node-fetch').default; // uncomment in NodeJS environments
const Sms77Client = require('sms77-client'); // uncomment in NodeJS environments
const smsClient = new Sms77Client("x2hAPX6YY6HG6uBpe3ebBwvP5F6YnxVIHEfHhPEJSs3eobmXK6E5MxfcezKjYRvn")
let checkInterval;
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

let status = "Running";

const http = require('http');
const { setTimeout, console } = require('globalthis/implementation');

const startDate = new Date().toDateString();;
const hostname = '0.0.0.0';
const port = 8080;


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
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/*
const checkCodes = () => {
    plzs.forEach(plz => {
        console.log("test", plz)
        let url = "https://003-iz.impfterminservice.de/rest/suche/termincheck?plz=" + plz + "&leistungsmerkmale=L920,L921,L922,L923"
        request({
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Cookie': 'bm_sz=EA1BCBD1D797B146930D23628EF87883~YAAQHHUWAkmo1Tt5AQAAY9a6jQtHhAEarJrZBeBve8zA10tZDLuacL1qmGnGgW9pxAAk4d5lHUmGzhfRUqpY5pqSwCIVjXS/1DTDvpubP37MqRJLVTM9bMI8o3zkx4ZazrrEGLvFX8Q3FDkN2N9LlGLS4DIEXXkCP4vehwgQR3sOmP8gORBGjar6sOMKLudZgl/kYD7udhjYbg==; ak_bmsc=B00B9868C994CEB8FB749440756648F91725E26D68780000378AA760A6C82446~plf0159/HCLRcsN93dkCG0hYk4FwXqXFPMY4GTnWWVBtLFIa3rsEwyvqPbBhjzQz/+TxprCYJ0mx0Y67QufRfjEUb+H1o5XBYkOADUQDbF9zYXFI3v69AXahO+y7KJpkvfcf13Fb+QmS1NYL8GP3hWAzrFprYDo+5cZmXB3+JiAiF6oH1+Zzapo83dTDvIFnSkL//4KGKfy6FKxIKMQfk9eb9nlr4FLP0GkuRJgNkLZIozg3TK7jtj17P21tgUyJZj; akavpau_User_allowed=1621593231~id=82f2b2566411cfa4d6e4be452771b2b4; _abck=4FC3204914D653A45A159C49B2634C50~0~YAAQbeIlF0qj+T95AQAAnepzjgWvJmIcIInCtvR9vszlm8wYOBWFVUr6vYcEwrdTh4+N//cGXqGz3Qeh136d2FwPz5uXY0ktpf29fR9wxXnzwV0FdomvOFVVcnMuWmMpQLl3DKGyhsd8AVlpgKyD1fwdg+VQpwg5eRrv+YWnGVh/XPUNl0N42JlrS72Nq5+MpLRGYonijNI5wsl8x1zV8FrRBP2ucFIxDAxjlJxuRUAUrhLca9euZB5AuwG8SOoyRYvODc3RDqkrEXl74sNr6515fgzOXejP9YIP3A6FamRD2vHB7RODB0PIXfzCtu8jFselNsMI+wv9/g5q79XDL91lY8fwtrfSUBiTMCsjaYo7u5cM1bmXZkjjPfxUM21s60CIpl+bjA1dJIltG3VpHhY/+87ZIvKaq0bqzUQayU0e1w==~-1~-1~-1'
                      },
            uri: url,
            method: 'GET'
        }, function (err, res, body) {
            //it works!node 
            console.log("Body-> s1" + res?.body);
            console.log("ERR-> " + err);
            if (err === null && res.body !== "401 Unauthorized" && res.body.toString().length >= 0) {
                const result = JSON.parse(res.body);
                const termineVorhanden = result.termineVorhanden;
                const vorhandeneLeistungsmerkmale = result.vorhandeneLeistungsmerkmale;
                if (true) {
                    //sendSms("found an appointment something, " + termine.toString().substring(0, 150));
                    console.log(url, res.body);
                    //  clearInterval(checkinterval);
                }
            } else {
                // sendSms("Error happened");
                //clearInterval(checkinterval);
                console.log(err)
            }

        });
    })

}
*/
const checkAppointments1 = () => {
    checkBalance();
    request({
        headers: {
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
            'Authorization': 'Basic OldQODYtQk5aQy1SVURQ',
        },
        uri: 'https://002-iz.impfterminservice.de/rest/suche/impfterminsuche?plz=88367',
        method: 'GET'
    }, function (err, res, body) {
        //it works!node 
        
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
        if (typeof res !== 'undefined') {
            console.log("Body-> s2 " + res.body);
            console.log("ERR-> " + err);
            if (err === null && res && res.body !== "401 Unauthorized" && res.body.toString().length >= 0) {
                const result = JSON.parse(res.body);
                const termine = result.termine;
                const termineTSS = result.termineTSS;
                const praxen = result.praxen;
                if (termine.length !== 0 || termineTSS.length !== 0 || Object.keys(praxen).length !== 0) {
                    foundAppointment = true;
                    sendSms("found an appointment something, " + termine.toString().substring(0, 150));
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

}

//checkCodes();

const calls = () => {
    i++;
    checkAppointments1();
    checkAppointments2();
}

try {
    checkInterval = setInterval(calls, 3000);
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

