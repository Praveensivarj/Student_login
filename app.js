const express =require('express'),app = express(), path = require('path'), hbs = require('hbs');
const mysql = require('mysql'), dotenv = require('dotenv'), cookieParser = require('cookie-parser');
require("dotenv").config();

const port = process.env.PORT

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Database connection successful!!");
    }
});
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

const location = path.join(__dirname,'./public');
app.use(express.static(location));
app.set('view engine','hbs');

const partialsPath = path.join(__dirname, './views/partials');
hbs.registerPartials(partialsPath);

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

app.listen(port, (err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log(`Server is running on http://localhost:${port}`);
    }
});