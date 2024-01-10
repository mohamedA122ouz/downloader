import express from 'express';
import cors from 'cors';
import ytdl from 'ytdl-core';
import sizeByUrl from "file_size_url";
import fs from "fs";
const app = express();
const units = ['B', 'KB', 'MB', 'GB', 'TB']
const nameRegex = /^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!prn$)[^\|\*\?\\:<>/$"]*[^\.\|\*\?\\:<>/$"]+$/ig;
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
app.listen(4000, () => {
    console.log('Donwnload server works !!!! at port 4000');
});
async function ytdlRespose2(req, res, ytdlOptions) {
    var URL = req.query.URL;
    try {
        let dt = await ytdl.getInfo(URL);
        let title = dt.videoDetails.title;
        let format = ytdl.chooseFormat(dt.formats, ytdlOptions);
        let fileSize = await sizeByUrl(format.url);
        fileSize = parseFloat(fileSize) * (1024 ** units.indexOf(fileSize.split(' ')[1]));
        title = title.replaceAll(nameRegex,"");
        console.log(fileSize);
        res.set("content-length", fileSize.toString());
        res.attachment(title + "." + ytdlOptions.format);
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
