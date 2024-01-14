import express from 'express';
import cors from 'cors';
import fs from 'fs';
import ytdl from 'ytdl-core';
import sizeByUrl from "file_size_url";
import c from "child_process";
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
function giveATry(res,tryToDo,handleFailer) {
    try {
        tryToDo();
    }
    catch (e) {
        if (!handleFailer) {
            console.error(Error(e));
            res.status(200);
            res.send(`<h1>${e}</h1>`);
            return;
        }
        handleFailer(e);
    }
}
async function ytdlRespose2(req, res, ytdlOptions) {
    var URL = req.query.URL;
    try {
        let dt = await ytdl.getInfo(URL);
        console.log(dt.formats[0].qualityLabel);
        let title = dt.videoDetails.title;
        let format = ytdl.chooseFormat(dt.formats, ytdlOptions);
        let fileSize = await sizeByUrl(format.url);
        fileSize = parseFloat(fileSize) * (1024 ** units.indexOf(fileSize.split(' ')[1]));
        title = title.replaceAll(nameRegex, "");
        console.log(fileSize);
        console.log(title);
        res.set("content-length", fileSize.toString());
        res.status(200);
        res.attachment((title || "video") + "." + ytdlOptions.format);
        ytdl.downloadFromInfo(dt).pipe(res);
    }
    catch (e) {
        res.send(`<h1>Error<h1><div>${e}</div>`);
        console.log("this is the problem ::\n", e);
    }
}
app.get("/admin/install/ytdlcore", (req, res) => {
    
    giveATry(res,() => {
        c.execSync("npm i ytdl-core@latest");
        res.status(200);
        res.send("<h1>installed</h1>");
    });

});
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
app.get("/test", (req, res) => {
    giveATry(() => {
        console.log(path.resolve("./test.mp4"));
        console.log(fs.statSync(path.resolve("./test.mp4")).size);
        res.attachment("test.mp4");
        res.set("content-lenght", (fs.statSync(path.resolve("./test.mp4")).size).toFixed(0));
        fs.createReadStream(path.resolve("./test.mp4")).pipe(res);
    });

});