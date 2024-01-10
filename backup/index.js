const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
app.use(cors());
app.listen(4000, () => {
    console.log('Donwnload server works !!!! at port 4000');
});
app.get('/download', (req, res) => {
    var URL = req.query.URL;
    try{
        res.header('Content-DisPosition', 'attachment; filename="Video.mp4"');
        ytdl(URL, {
            format: 'mp4',
            quality: 'highest',
            filter: 'videoandaudio'
        }).pipe(res);
    }
    catch(e){
        res.send(`<h1>Error<h1><div>${e}</div>`);
        console.log("this is the problem ::\n",e);
    }
});
app.get('/download/audio', (req, res) => {
    var URL = req.query.URL;
    try {
        res.header('Content-DisPosition', 'attachment; filename="audio.mp3"');
        ytdl(URL, {
            format: 'wav',
            filter: 'audioonly'
        }).pipe(res);
    }
    catch (e) {
        res.send(`<h1>Error<h1><div>${e}</div>`);
        console.log("this is the problem ::\n",e);
    }
});
