const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path')

//use pug html render
app.set('views', __dirname + '/views');
app.set('view engine', 'pug')
//

app.get('/', (req, res, next) => {
    //res.sendFile(__dirname + '/index.pug');
    res.render('index', { title: 'Video Player'});
});

app.get('/video', (req, res) => {
    const range = req.headers.range;
    if (!range) {
        res.status(400).json({message: "Require Range header"});
    }
    const videoPath = "minecraft.mp4";
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10**6 //1MB
    const start = Number(range.replace(/\D/g, "")); // /\D/g global find character is not number and replace it with ""
    const end = Math.min(start+CHUNK_SIZE, videoSize-1);
    const contentLength = end - start + 1;

    const headerRes = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    };
    res.writeHead(206,headerRes);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

module.exports = app;