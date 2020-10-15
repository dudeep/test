import { createServer, request } from 'http';
import { appendFile, createReadStream, readFileSync } from 'fs';
//import { compileAndRender } from './handler/functions.js';
import pug from 'pug';
import { resolve,parse } from 'path';

const server = createServer().listen(process.env.PORT || 4000);
const indexPath = process.env.PWD + '/pages/index.pug';
//const nbConnection = readFileSync('./handler/counter.txt');

// server.once('connection', (...info) => {
//     console.log(info[0].eventNames())
//     appendFile('./handler/counter.txt', 1, 'utf8', (err) => {
//         if (err) console.log(err);
//     });
// });
// server.getConnections((err, coutnConnection) =>{
//     if (err) console.log(err);
//     coutnConnection ++;
//     //console.log(coutnConnection);
// })
server.on('data', (...arg)=> console.log(arg))
server.on('request', (req, res) => {

    postHandler(req, res);

    if (req.url === '/style.css') {
        res.writeHead(200, { 'content-type': 'text/css' })
        createReadStream('./public/style.css')
            .pipe(res);
    }
    else if (req.url === '/index.js') {
        res.writeHead(200, { 'content-type': 'text/js' })
        createReadStream('./public/index.js')
            .pipe(res);
    }
    else if (req.url === '/' || req.url === '/home') {
        res.writeHead(200, { 'content-type': 'text/html' });
        res.write(pug.renderFile(indexPath, { 
            page: "Welcome HOME",
            nbco: 0
         }))
        res.end();
    }
    else if (req.url === "/about") {
        res.writeHead(200, { 'content-type': 'text/html' });
        res.write(pug.renderFile(indexPath, { page: "My name is Gaetan and I'm currently working in controlling management" }))
        res.end();
    }
    else if(req.url === "/public/photo.jpeg"){
        const phSrc = resolve('public/logo.jpg');
        res.writeHead(200, { 'content-type': 'image/jpg' });
        createReadStream(phSrc)
            .pipe(res);
    }
})

const postHandler = (rq, rp) => {
    
    if(rq.method === 'POST'){
        console.log(rq)
        let body="";
        rq.on("data", (chunk)=> {
            console.log("data event", chunk.toString())
            body += chunk.toString()
        });
        rq.on("end", (chunk)=>{
            console.log("end event")
            console.log(body)
            rp.end()
        })
    }
}