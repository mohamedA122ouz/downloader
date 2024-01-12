import express from 'express';
import cors from 'cors';
import fs from 'fs';
import ytdl from 'ytdl-core';
import sizeByUrl from "file_size_url";
import path from "path";
const app = express();
const units = ['B', 'KB', 'MB', 'GB', 'TB']
const nameRegex = /[:|\\|\/|*|?|\"|<|>|\|]/ig;
const port = process.env.PORT || 4000;
const videoOptions = {
    format: 'mp4',
    quality: "highest",
    filter: "audioandvideo"
};
const audioOptions = {
    format: 'wav',
    filter: 'audioonly'
};
app.use(cors());
app.listen(port, '0.0.0.0', () => {
    console.log(`Donwnload server works !!!! at ${port} `);
});
async function ytdlRespose2(req, res, ytdlOptions) {
    var URL = req.query.URL;
    try {
        let dt = await ytdl.getInfo(URL);
        let title = dt.videoDetails.title;
        let format = ytdl.chooseFormat(dt.formats, ytdlOptions);
        let fileSize = await sizeByUrl(format.url);
        fileSize = parseFloat(fileSize) * (1024 ** units.indexOf(fileSize.split(' ')[1]));
        title = title.replaceAll(nameRegex, "");
        console.log(fileSize);
        console.log(title);
        res.set("content-length", fileSize.toString());
        res.status(200);
        console.log(res.getHeader());
        console.log(res.statusCode);
        res.attachment((title || "video") + "." + ytdlOptions.format);
        ytdl(URL, ytdlOptions).pipe(res);
    }
    catch (e) {
        res.send(`<h1>Error<h1><div>${e}</div>`);
        console.log("this is the problem ::\n", e);
    }
}

app.get('/download', (req, res) => {
    ytdlRespose2(req, res, videoOptions);
});
app.get('/download/audio', (req, res) => {
    ytdlRespose2(req, res, audioOptions);
});
app.get('/home', (req, res) => {
    let file = path.resolve("./easyWay.html");
    res.status(200);
    console.log(path.join(port.toString(), "./easyWay.html"));
    res.sendFile(file);
});