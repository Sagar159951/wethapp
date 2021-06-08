const http = require("http");
const fs = require("fs");
const express = require("express");
var requests = require("requests");
const app = express();
const port = process.env.PORT || 8000;

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal, orgVal) => {
    let tempreature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    tempreature = tempreature.replace("{%tempmin%}", orgVal.main.temp_min);
    tempreature = tempreature.replace("{%tempmax%}", orgVal.main.temp_max);
    tempreature = tempreature.replace("{%location%}", orgVal.name);
    tempreature = tempreature.replace("{%conutry%}", orgVal.sys.country);
    tempreature = tempreature.replace("{%tempStatus%}", orgVal.weather[0].main);
    
    return tempreature;
}

    
    app.get("/", (req, res) => {
        var cname = req.query.fname;

        requests(`http://api.openweathermap.org/data/2.5/weather?q=${cname},IN&APPID=f7fb0b4b12d917043c5f0b7bfee63d2d`)
            .on('data', (chunk) => {
            const onjdata =JSON.parse(chunk);
            const arrData = [onjdata];
            const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
            res.write(realTimeData);
        })
            .on('end', (err) =>  {
            if (err) return console.log('connection closed due to errors', err);
            res.end();   
        });
    })

app.listen(port, () => {
    console.log(`listening on ${port}`);
})