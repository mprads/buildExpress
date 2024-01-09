const methods = require('methods');
const http = require('http');

const middleware = require('./middleware/init');
const Router = require('./router');

const app = exports = module.exports = {};
const slice = Array.prototype.slice;

app.init = function() {
    this.cache = {};
    this.engines = {};
    this.settings = {};
    this._router = undefined;
};

app.lazyrouter = function lazyrouter() {
    if(!this._router) {
        this._router = new Router({});
    }

    // Setting up a layer at '/' that call the next function
    this._router.use(middleware.init(this));
};

app.listen = function listen(...arugments) {
    const server = http.createServer(this);
    return server.listen.apply(server, arugments);
};

app.handle = function handler(req, res, callback) {
    var router = this._router;

    router.handle(req, res);
};

// arrow functions do not create their own this binding
methods.forEach(function(method) {
    app[method] = function(path) {
        this.lazyrouter();

        const route = this._router.route(path);
        // Create a layer whose handle will be executed when the matching path is passed
        route[method].apply(route, slice.call(arguments, 1));
        return this;
    }
});