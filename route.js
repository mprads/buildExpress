const methods = require('methods');
const { flatten }  = require('array-flatten');

var Layer = require('./layer')

module.exports = Route;

function Route(path) {
    this.path = path;
    this.stack = [];
    this.methods = {};

};

Route.prototype.dispatch = function dispatch(req,res,done) {};

methods.forEach(function(method) {
    Route.prototype[method] = function() {
        var handles = flatten(Array.prototype.slice.call(arguments));

        for (var i = 0; i < handles.length; i++) {
            const handle = handles[i];

            if (typeof handle !== 'function') {
                const type = toString.call(handle);
                const msg = `Route.${method}() requires a callback function but go a ${type}`;

                throw new Error(msg);
            };

            const layer = Layer('/', {}, handle);
            layer.method = method;

            this.methods[method] = true;
            this.stack.push(layer);
        }; 
    };
});