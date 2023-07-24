import http from "http";
import fs from "fs";
// var requests=require("requests");
import requests from "requests";

const homeFile=fs.readFileSync("home.html","utf-8");

const replaceVal=(tempVal,orgVal)=>{
     let temperature=tempVal.replace("{%tempval%}", orgVal.main.temp);
     temperature=temperature.replace("{%tempmin%}", orgVal.main.temp_min);
     temperature=temperature.replace("{%tempmax%}", orgVal.main.temp_max);
     temperature=temperature.replace("{%location%}", orgVal.name);
     temperature=temperature.replace("{%country%}", orgVal.sys.country);
     temperature=temperature.replace("{%tempStatus%}", orgVal.weather[0].main);
     return temperature;
}
const server=http.createServer((req,res)=>{
    if(req.url=="/"){
        requests('https://api.openweathermap.org/data/2.5/weather?lat=26.44&lon=80.33&appid=e3eef335bc88efc742247ac190aa2495'
        )
          .on('data',(chunk)=> {
             const objdata=JSON.parse(chunk);
             const arrData=[objdata];

             // console.log(arrData[0].main.temp);
             const realTimeData=arrData.map(val=> replaceVal(homeFile,val))
             .join("");
             res.write(realTimeData);
})

.on('end',(err)=> {
  if (err) return console.log('connection closed due to errors', err);
  res.end();
 
  console.log('end');
})
    }
});
server.listen(8000,"127.0.0.1");