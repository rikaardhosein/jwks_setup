cd cert
openssl req -new -newkey rsa:1024 -days 3650 -nodes -x509 -keyout privkey.pem -out cert.pem
#openssl pkey -in privkey.pem -out pubkey.pem -pubout
openssl rsa -in privkey.pem -RSAPublicKey_out -out pubkey.pem
