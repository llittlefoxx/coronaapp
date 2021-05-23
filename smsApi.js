const config = require('./config').config;
const Sms77Client = require('sms77-client');
const smsClient = new Sms77Client(config.smsClientApiKey);

const sendSms = (smsText) => {
    return smsClient.sms({
        from: config.appName,
        to: config.alertPhoneNumber,
        text: smsText
    }).then(response => console.log(response))
        .catch(console.error);
}

const checkBalance = () => {
    smsClient.balance().then((balance) => {
        console.log("my balance: " + balance);
        if (balance <= (0.075)) {
            sendSms("Charji el compte");
            clearInterval(checkinterval);
        } else {
            console.log("Balance still good")
        }
    }).catch(console.error);
}
module.exports = {
    sendSms,
    checkBalance
}