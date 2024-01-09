const proto = require('./app');
const mixin = require('merge-descriptors');

exports = module.exports = createApplication;

function createApplication() {
    const app = function(req, res, next) {
        app.handle(req, res, next);
    };

    // Allow the app to make use of the proto methods while maintaining its orginal state and without chaing prototype
    mixin(app, proto, false);
    app.init();

    return app;
};

exports.application = proto;