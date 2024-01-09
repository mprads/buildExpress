const setPrototypeOf = require('setprototypeof');
const parseUrl = require('parseurl');

const Route = require('./route');
const Layer = require('./layer');

const proto = module.exports = function(options) {
    const opts = options || {};

    function router(req, res, next) {
        router.handle(req, res, next);
    };

    setPrototypeOf(router, proto);

    router.params = {};
    router._params = [];
    router.caseSensitive = opts.caseSensitive;
    router.mergeParams = opts.mergeParams;
    router.strict = opts.strict;
    router.stack = [];

    return router;
};

proto.route = function route(path) {
    const route = new Route(path);

    const layer = new Layer(path, {}, route.dispatch.bind(route));

    layer.route = route;
    this.stack.push(layer);

    return route;
};

proto.handle = function handle(req, res, out) {
    const self = this;
    const stack = self.stack;
    var index = 0;

    next();

    // Making use of js closures so that when next is called from the callback it has the current index and layer to resume
    function next() {
        const path = getPathname(req);

        var layer, match, route;

        // Iterate over the stack until you find a matching path then handle the request
        while (!match && index < stack.length) {
            layer = stack[index++];
            match = matchLayer(layer, path);
            route = layer.route;

            if (!match) continue;
            if (!route) continue;

            route.stack[0].handle_request(req, res, next);
        };

        // Layer on stack but no route
        if(match) {
            layer.handle_request(req, res, next);
        };
    };
};

proto.use = function use(fn) {
    const layer = new Layer('/', {}, fn);

    layer.route = undefined;
    this.stack.push(layer);

    return this
}

function getPathname(req) {
    try {
        return parseUrl(req).pathname;
    } catch (err) {
        return undefined;
    };
};

function matchLayer(layer, path) {
    try {
        return layer.match(path);
    } catch (err) {
        return err;
    };
};