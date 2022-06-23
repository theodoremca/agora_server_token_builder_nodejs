const express = require("express");
const {RtcTokenBuilder,RtcRole} = require("agora-access-token");
const {config} = require("dotenv")

config();

const PORT = 8080

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

const app = express();

const nocache = (req,res,next) => {
    res.header('Cache-control','private','no-cache','no-store','must-revalidate');
    res.header('Expires','-1');
    res.header('Pragma','no-cache');
    next()
}

const generateAccessToken = ( req, res ) => {
    res.header('Access-Control-Allow-Origin','*'); // avoid COS error

    const channelName = req.query.channelName;
    if(!channelName) return res.status(500).json({'error':'channelName is required'});

    let uid = req.query.uid;
    if(!uid || !uid.length) uid = 0;


    let role = RtcRole.SUBSCRIBER;
    if(req.query.role === 'publisher') role = RtcRole.PUBLISHER;

    let expirationTime = req.query.expirationTime
    expirationTime = (!expirationTime || !expirationTime.length) ? 3600 : parseInt(expirationTime,10);


    const currentTime = Math.floor(Date.now() / 1000);
    privilegedExpirationTime = currentTime + expirationTime

    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID,APP_CERTIFICATE,channelName,uid,role,privilegedExpirationTime)

   return res.json({token})

}

app.get('/access_token',nocache,generateAccessToken);

app.listen(PORT,()=>{
    console.log(`Listening to port: ${PORT}`)
})
