const express = require ("express");
const ejs = require ("ejs")
const bodyParser = require ("body-parser")

const app = express()

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
    extended: true
}))


app.get("/",(req,res) => {
    res.render("home")
})

app.get("/primogems",(req,res) => {
    res.render("primogems")
})
app.get("/resin",(req,res) => {
    res.render("resin")
})
app.get("/events",(req,res) => {
    res.render("events")
})


app.listen(process.env.PORT||3000,(req,res) => {
    console.log("Server is running!");
})