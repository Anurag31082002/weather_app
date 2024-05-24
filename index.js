const http=require('http');
const fs=require('fs');
var requests=require("requests");
const homeFile=fs.readFileSync("home.html","utf-8");
const replaceval = (tempVal, OrgVal) => {
    let temperature = tempVal.replace("{%tempval%}", Math.round(OrgVal.main.temp - 273.15));
    temperature = temperature.replace("{%tempmin%}", Math.round(OrgVal.main.temp_min - 273.15));
    temperature = temperature.replace("{%tempmax%}", Math.round(OrgVal.main.temp_max - 273.15));
    temperature = temperature.replace("{%location%}", OrgVal.name);
    temperature = temperature.replace("{%country%}", OrgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", OrgVal.weather[0].main);
    return temperature;
}


const server=http.createServer((req,res)=>{
    if(req.url="/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Lucknow&appid=1e892a7a6f3099294a24bfcdc08f2c4b")
        .on("data",(chunk)=>{
            const objData=JSON.parse(chunk);
            const arrData= [objData];
            // console.log(arrData[0].main.temp);
            const realTimeData=arrData.map((val)=>replaceval(homeFile,val)).join("");
            res.write(realTimeData);
            // console.log(realTimeData);
       
            
        })
        .on("end",(err)=>{
            if(err) return console.log("connection closed due to errors",err);
            res.end();
        });
        
    }
    
});
server.listen(8000,"127.0.0.1");