const http = require('http');
const path = require('path');
const fs = require('fs');
const {promisify} = require('util');
const handlebars = require('handlebars');
const mime = require('./mime');

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const conf = require('./config/defaultConfig.js');
const tplPath = path.join(__dirname, '/template/dir.html');
const source = fs.readFileSync(tplPath, 'UTF-8');
const template = handlebars.compile(source);

const server = http.createServer((req, res) => {
    const filePath = path.join(conf.root, req.url);
    async function route() {
        try {
            const stats = await stat(filePath);
            if (stats.isFile()) {
                const contentType = mime(filePath);
                res.statusCode = 200;
                res.setHeader('Content-Type', contentType);
                fs.createReadStream(filePath).pipe(res);
            } else if (stats.isDirectory()) {
                const fileList = await readdir(filePath);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                const dir = path.relative(conf.root, filePath);
                const data = {
                    title: path.basename(filePath),
                    dir: dir ? `/${dir}` : '',
                    fileList: fileList.map(file => {
                        return {
                            file: file,
                            icon: mime(file)
                        };
                    })
                };
                res.end(template(data));
            }
        } catch (err) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end(`${filePath} is not a directory or ${err}`);
            return;
        }
    }
    route();
});

server.listen(conf.port, conf.hostname, () => {
    const addr = `http://${conf.hostname}:${conf.port}`;
    console.log(`server started at ${addr}`);
});