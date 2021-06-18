const bcrypt = require('bcryptjs')
let fs = require("fs")
const express = require('express')
const app = express()
const port = 9000
const bodyParser = require("body-parser")
const cors = require("cors")

let rsa = require("node-rsa")
let privateKey = new rsa()
let publicKey = new rsa()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



app.listen(port, () => {
    let key = new rsa().generateKeyPair()
    let pubkey = key.exportKey("public")
    let prikey = key.exportKey("private")
    fs.openSync("./public.pem", "w")
    fs.writeFileSync("./public.pem", pubkey, "utf8")
    fs.openSync("./private.pem", "w")
    fs.writeFileSync("./private.pem", prikey, "utf8")
    console.log(`Example app listening at http://localhost:${port}`)
})// TAO CAP KEY CHO GIAI DOAN 2 NGAY BAN DAU

async function CreateHash() {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash("abc", salt)
    fs.openSync("./hash.pem", "w")// TAO HASH
    fs.writeFileSync("./hash.pem", hashedPassword, "utf8")
}
CreateHash()



app.post('/register', (req, res) => {
    let key = req.body.key
    privateKey.importKey(key)
    let hash = fs.readFileSync("./hash.pem", "utf8")
    let private = fs.readFileSync("./private.pem", "utf8")
    let encrypted = privateKey.encryptPrivate(
        hash,
        "base64"
    )
    res.send(encrypted + "@@@@@" + private)// GUI MA ENCRYPT HASH VS PRIVATE KEY(CHO GIAI DOAN 2)
})

app.post('/data', (req, res) => {
    let data = req.body.data// LAY MA CHUA DU LIEU
    let public = fs.readFileSync("./public.pem", "utf8")
    publicKey.importKey(public)
    let data_decrypted = publicKey.decryptPublic(data, "utf8")// DECRYPT DU LIEU
    let hash = fs.readFileSync("./hash.pem", "utf8")
    array_data = data_decrypted.split(hash)// TACH XAU VS HASH, NEU KO TACH DC DUNG GIA TRI HASH, KO LUU GIU LIEU, NEU DUNG, LUU DU LIEU
})