const jwt = require('jsonwebtoken');
const fs = require('fs');
const rsaPemToJwk = require('rsa-pem-to-jwk');

const pub = fs.readFileSync('./cert/pubkey.pem', 'utf-8');
const priv = fs.readFileSync('./cert/privkey.pem', 'utf-8');
const cert = fs.readFileSync('./cert/cert.pem', 'utf-8');

const express = require('express');

var payload = {
  "iss": "https://secure.rikaard.io/",
  "sub": "test",
  "aud": [
    "https://rikaardhosein.auth0.com/api/v2/",
    "https://auth0.auth0.com/userinfo"
  ],
  "expiresIn": "10y",
  "algorithm": "RS256"
};

const pubKeyToJwk = function(pub) {
  var jwk = rsaPemToJwk(pub, {use: "sig"}, "public");
  var s = cert.indexOf('\n');
  var e = cert.substr(0, cert.length-1).lastIndexOf('\n');
  var c = cert.substring(s+1, e);
  const regex = /\n/gi;
  c = c.replace(regex,'');
  jwk.x5c = [c];
  jwk.kid = 1;
  return jwk;
}

const jwk = pubKeyToJwk(pub);
console.log(jwk);

const app = express();
const port = 8085;
const host = "0.0.0.0";

app.get('/.well-known/jwks.json', function(req, res) {
  return res.send(JSON.stringify(jwk));
});

app.get('/', function(req, res){
  const token = jwt.sign(payload, priv, {keyid:"1", algorithm: "RS256"});
  return res.send(token);
});


app.listen(port, host,() => console.log(`Listening at http://${host}:${port}`));
