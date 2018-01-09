const path = require('path');

const mimeType = {
    'css': 'text/css',
    'git': 'image/gif',
    'html': 'text/html',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpg',
    'json': 'application/json',
    'pdf': 'application',
    'png': 'image/png',
    'txt': 'text/plain',
    'wav': 'audio/x-wav'
};

module.exports = (filePath) => {
    let ext = path.extname(filePath)
    .split('.')
    .pop()
    .toLowerCase()
    if (!ext) {
        ext = filePath;
    }
    return mimeType[ext] ||mimeType['txt'];
};