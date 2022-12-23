/**
 * Created by harsh on 13/01/18.
 */
'use strict';

if (process.env.NODE_ENV == 'dev') {
    exports.config = {
        PORT : 8004,
        dbURI : 'mongodb://localhost/daktarz'
    }
}
else if (process.env.NODE_ENV == 'test') {
    exports.config = {
        PORT : 8000,
        dbURI : ''
    }
}

else {
    exports.config = {
        PORT : 8005,
        dbURI : 'mongodb://localhost/daktarz'
    };
}