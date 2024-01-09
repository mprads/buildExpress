const http = require('http');
const mixin = require('merge-descriptors');

const proto = require('./app');


exports = module.exports = createApplication;

function createApplication() {
    const app = function(req, res, next) {
        app.handle(req, res, next);
    };

    // Allow the app to make use of the proto methods while maintaining its orginal state and without chaing prototype
    mixin(app, proto, false);
  
    const req = Object.create(http.IncomingMessage);
    const res = Object.create(http.ServerResponse.prototype);

    res.send = function(body) {
        if(typeof body === 'object') {
            this.json(body)
        }
        else if(typeof body === 'string') {
            this.setHeader('Content-Type', 'text/plain');
            this.end(body,'utf8');
        }
        return this;
    };

    res.json = function(body) {
        this.setHeader('Content-Type', 'application/json');
        return this.send(JSON.stringify(body));
    }

    app.response = Object.create(res, {
        app: {
            configurable: true,
            enumerable: true,
            writable: true,
            value: app
        }
    });

    app.init();
    
    return app;
};

exports.application = proto;