// boring functions :P
var rf=(file)=>{return fs.readFileSync(__dirname+"/"+file,"utf8")}
var rJson=(file)=>{return JSON.parse(rf(file))}
// requirements :O
var app=require("express")()
var fs=require("fs")
// config lol
var config=rJson("config.json")
// basic parseing
var parse=(req,res,data)=>{
    var sendError=(code,error)=>{
        var snd=""
        if(code==1){
            snd="Error parsing slides. File "+error+" was not found."
        }
        res.type("txt")
        return res.send(snd);
    }
    // var get data and amount of slides and stuff :P
    var snd=data;
    var slides=data.split("{SLIDES:")
    // for each slide
    for(let i=0;i<slides.length;i++){
        // get the slide data :O
        var slideData=slides[i].split("}")[0].split(",")
        // name,amount,file type :PPP
        var name=slideData[0]
        var amount=parseInt(slideData[1])
        var filetype=slideData[2]
        // replace the stupid thing with the actual slides XD
        var parsed=slideParse(name,amount,filetype)
        var sc=parsed[0];
        // check if it was a success
        if(sc==0){
            // it was :D
            snd=snd.replace("{SLIDES:"+slides[i].split("}")[0]+"}",parsed[1])
        }else {
            // it wasnt >W<
            sendError(sc,parsed[1])
        }
    }
    console.log(snd)
    // send data
    return snd;
}
// parse the slide info
var slideParse=(name,amount,filetype)=>{
    // initial data stuff
    var snd='<div class="cnt" align="center">'
    // for each slide do this XD
    for(let i=0;i<amount;i++){
        // check if it exists first :)
        if(!fs.existsSync(__dirname+"/rawFiles/raw/"+name+(i+1)+"."+filetype)){
            // ermagard! it doesnt :<
            return [1,name+(i+1)+"."+filetype];
        }
        // add to the data with the slide name :P
        snd+='<img src="'+config.url+'/raw/'+name+(i+1)+'.'+filetype+'" class="sld">'
        // if its the end one it doesnt need a new line so we wont add one! :L
        if(i!=(amount-1)){
            snd+='<br/>'
        }
    }
    // top it off!
    snd=snd+"</div>"
    // return that
    return [0,snd];
}
// check if its a file :DD
app.get("*",(req,res)=>{
    // get pages
    var pgs=rJson("pages.json")
    // send page function :D
    var sndPg=(pg)=>{
        // woahhhh :3 gotta load the page
        var send=rf(pgs[pg])
        res.type("html")
        res.send(parse(req,res,send))
    }
    // check if its a web page
    if(pgs[req.originalUrl]!=undefined){
        // its a page with the current url soooo send it as is :D
        sndPg(req.originalUrl)
    }
    // maybe they just added a "/" at the end XD
    if(pgs[req.originalUrl.slice(0,-1)]!=undefined){
        // we have to remove that last slash soo
        sndPg(req.originalUrl.slice(0,-1))
    }
    // but wait!!! it could be a raw image request :3
    if(req.originalUrl.replace("/raw/")!=req.originalUrl){
        // its a request for a raw file! lets check if it exists first :P
        if(fs.existsSync(__dirname+"/rawFiles"+req.originalUrl)){
            // woah thats cool it is :P whatever though idc or anything X3
            return res.sendFile(__dirname+"/rawFiles"+req.originalUrl)
        }
    }
    // awww no file, thats ok... send a 404 error x3
    res.type("txt")
    res.send("are you lost?")
})
// ok web server finished time to load :3
app.listen(config.port,()=>{console.log("LOADED :D")})