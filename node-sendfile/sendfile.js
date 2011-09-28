var fs = require('fs');

// Static middleware which utilizes the sendfile() kernel method
// to improve performance of static file serving in Node.js
exports = module.exports = function static(root, opt) {
    opt = opt || {};

    // root required
    if (!root) throw new Error('static() root path required');
    opt.root = root;

    return function(req, res, next) {
        var file = opt.root + req.url,
            start = 0,
            socket = req.socket;
        
        fs.stat(file, function(err, stats) {
            if (err) return next(err);
            end = stats.size;
    
            // Open file so that file descriptor can be passed to sendfile()
            fs.open(file, 'r', function(err, fd) {
                if (err) return next(err);
        
                 // ensure headers are rendered
                if (! res._header) {
                    res.writeHead(res.statusCode || 200, {
                        'Content-Length': stats.size
                    });
                }
                
                // force sending of the headers
                var ret = res._send('');
                
                var send = function() {
                    try {
                    fs.sendfile(socket.fd, fd, start, end, function(err, written) {
                        if (err) {
                            if (err.code === 'EAGAIN') {
                                // do something here
                            }
                            return done(err);
                        }
                
                        start += written;
                        end -= written;
                
                        if (end > 0) return send();
                
                        done();
                    });
                    } catch (e) {
                        res.end();
                        console.log(e);
                    }
                };
                
                var done = function(err) {
                    if (res.finished) return;
                    socket.removeListener('error', done);
    
                    fs.close(fd);
    
                    res.end();
    
                    if (err) {
                        socket.destroy();
                        next(err);
                    }
                };
    
                socket.on('error', done);
                
                // if for whatever reason the buffer is full, 
                // wait for it to drain first
                if (ret === false) {
                    socket.once('drain', send);
                } else {
                    send();
                }
            });
        });
    };
};