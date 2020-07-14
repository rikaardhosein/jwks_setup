const jwt = require('jsonwebtoken');
const fs = require('fs');
const rsaPemToJwk = require('rsa-pem-to-jwk');

const pub = fs.readFileSync('./cert/pubkey.pem', 'utf-8');
const priv = fs.readFileSync('./cert/privkey.pem', 'utf-8');
const cert = fs.readFileSync('./cert/cert.pem', 'utf-8');

const express = require('express');

var payload = {
  "issuer": "https://issuer.rikaard.io:8085/",
  "subject": "google-oauth2|109467639016817594013",
  "audience": [
    "https://rikaardhosein.auth0.com/api/v2/",
    "https://auth0.auth0.com/userinfo"
  ],
  "expiresIn": 694741530,
  "algorithm": "RS256"
};

var token = jwt.sign(payload, priv, payload);
console.log(token);



var legit = jwt.verify(token, pub, {algorithm: "RS256"});
console.log(legit);


var jwk = rsaPemToJwk(pub, {use: 'sig'}, 'public');
var s = cert.indexOf('\n');
var e = cert.substr(0, cert.length-1).lastIndexOf('\n');
var c = cert.substring(s+1, e);
const regex = /\n/gi;
c = c.replace(regex,'');
jwk.x5c = c;
console.log(jwk);

const app = express();
const port = 8085;
const host = "0.0.0.0";

app.get('/.well-known/jwks.json', function(req, res) {
  return res.send(JSON.stringify(jwk));
});

app.get('/token', function(req, res){
  return res.send(token);
});
app.listen(port, host,() => console.log(`Example app listening at http://${host}:${port}`));
