function getByEmail(email, callback) {
    // This script should retrieve a user profile from your existing database,
    // without authenticating the user.
    // It is used to check if a user exists before executing flows that do not
    // require authentication (signup and password reset).
    //
    // There are three ways this script can finish:
    // 1. A user was successfully found. The profile should be in the following
    // format: https://auth0.com/docs/user-profile/normalized.
    //     callback(null, profile);
    // 2. A user was not found
    //     callback(null);
    // 3. Something went wrong while trying to reach your database:
    //     callback(new Error("my error message"));


    function getMgmtAPIV1Token(cb) {
        var request = require("request");
        var options = {
            method: 'POST',
            url: 'https://' + configuration.AUTH0_DOMAIN + '/oauth/token',
            headers:
                { 'content-type': 'application/json' },
            body: JSON.stringify({
                "client_id": configuration.CLIENT_ID,
                "client_secret": configuration.CLIENT_SECRET,
                "grant_type": "client_credentials"
            })
        };

        request(options, function (error, response, body) {
            if (error) return cb(new Error(error));
            var token = JSON.parse(body).access_token;
            saveOrUpdateAPIV1TokenInConfig(token, function (err, status) {
                console.log(err); 
                console.log(status);
                return cb(null, token);
            });

        });
    }

    function getAPIV1Token(fetch, cb) {
        if (!fetch) return getAPIV1TokenFromConfig(cb);
        else getMgmtAPIV1Token(cb);
    }

    getAPIV1Token(false, function (error, token) {

        if (error) return callback(new Error(error));
        console.log(token);
        var options = {
            method: 'GET',
            url: 'https://' + configuration.AUTH0_DOMAIN + '/api/connections/' + configuration.AD_CONNECTION_NAME + '/users',
            qs: { search: email },
            headers:
            {
                'cache-control': 'no-cache',
                authorization: 'Bearer ' + token
            }
        };

        request(options, function (error, response, body) {
            if (error) return callback(new Error(error));
            if (response.statusCode === 401) {

                getAPIV1Token(true, function (error, token) {
                    if (error) return callback(new Error(error));
                    options = {
                        method: 'GET',
                        url: 'https://' + configuration.AUTH0_DOMAIN + '/api/connections/' + configuration.AD_CONNECTION_NAME + '/users',
                        qs: { search: email },
                        headers:
                        {
                            'cache-control': 'no-cache',
                            authorization: 'Bearer ' + token
                        }
                    };

                    request(options, function (error, response, body) {
                        if (error) return callback(new Error(error));


                        var users = JSON.parse(body);
                        if (users.length === 0) return callback(null);
                        else return callback(null, users[0]);

                    });

                });

            }
            else {

                var users = JSON.parse(body);
                if (users.length === 0) return callback(null);
                else return callback(null, users[0]);
            }

        });

    });



    function getMgmtAPIV2Token(cb) {
        var request = require("request");
        var options = {
            method: 'POST',
            url: 'https://' + configuration.AUTH0_DOMAIN + '/oauth/token',
            headers:
                { 'content-type': 'application/json' },
            body: JSON.stringify({
                "client_id": configuration.V2_CLIENT_ID,
                "client_secret": configuration.V2_CLIENT_SECRET,
                "audience": "https://" + configuration.AUTH0_DOMAIN + "/api/v2/",
                "grant_type": "client_credentials"
            })
        };


        request(options, function (error, response, body) {
            if (error) return cb(new Error(error));
            //console.log(body);
            var token = JSON.parse(body).access_token;
            return cb(null, token);
        });

    }

    function getConnection(token, cb) {

        var request = require("request");

        var options = {
            method: 'GET',
            url: 'https://' + configuration.AUTH0_DOMAIN + '/api/v2/connections',
            qs: { name: configuration.CONNECTION_NAME },
            headers:
            {
                'cache-control': 'no-cache',
                authorization: 'Bearer ' + token
            }
        };

        request(options, function (error, response, body) {
            if (error) return cb(new Error(error));
            console.log(JSON.parse(body)[0]);
            return cb(null, JSON.parse(body)[0]);

        });


    }

    function updateConnection(token, id, connOptions, cb) {

        var request = require("request");

        var options = {
            method: 'PATCH',
            url: 'https://' + configuration.AUTH0_DOMAIN + '/api/v2/connections/' + id,
            headers:
            {
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                authorization: 'Bearer ' + token
            },
            body: JSON.stringify( { "options" : connOptions })
        };

        request(options, function (error, response, body) {
            console.log(error);
            if (error) return cb(new Error(error));
            console.log(body);
            return cb(null, true);
        });

    }

    function saveOrUpdateAPIV1TokenInConfig(v1Token, cb) {
        return getMgmtAPIV2Token(function (error, token) {

            if (error) return callback(new Error(error));

            return getConnection(token, function (error, connectionData) {
                if (error) return callback(new Error(error));
                console.log(connectionData);
                var id = connectionData.id;
                var connOptions = connectionData.options;
                connOptions.bareConfiguration = connOptions.bareConfiguration || {};
                connOptions.bareConfiguration.API_V1_TOKEN = v1Token;
                console.log(connOptions);
                updateConnection(token, id, connOptions, function(error, status){
                    if (error) return cb(new Error(error));
                    console.log("after uodate");
                    return cb(null, status);
                });


            });


        });
    }

    function getAPIV1TokenFromConfig(cb) {
        console.log(configuration.API_V1_TOKEN);
        return cb(null, configuration.API_V1_TOKEN);
    }


}
