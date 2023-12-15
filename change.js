async function changePassword(email, newPassword, callback) {
    // This script should change the password stored for the current user in your
    // database. It is executed when the user clicks on the confirmation link
    // after a reset password request.
    // The content and behavior of password confirmation emails can be customized
    // here: https://manage.auth0.com/#/emails
    // The `newPassword` parameter of this function is in plain text. It must be
    // hashed/salted to match whatever is stored in your database.
    //
    // There are three ways that this script can finish:
    // 1. The user's password was updated successfully:
    //     callback(null, true);
    // 2. The user's password was not updated:
    //     callback(null, false);
    // 3. Something went wrong while trying to reach your database:
    //     callback(new Error("my error message"));
    //
    // If an error is returned, it will be passed to the query string of the page
    // where the user is being redirected to after clicking the confirmation link.
    // For example, returning `callback(new Error("error"))` and redirecting to
    // https://example.com would redirect to the following URL:
    //     https://example.com?email=alice%40example.com&message=error&success=false

    const transformRequest = (jsonData = {}) => Object.entries(jsonData).map(x => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`).join('&');
    const axios = require("axios");
    const getToken = async () => {

        const url = "https://login.microsoftonline.com/pushpb2c.onmicrosoft.com/oauth2/v2.0/token";

        const input = {
            "grant_type": "client_credentials",
            "client_id": "aef09705-7ba3-45d8-867c-468311736193",
            "scope": "https://graph.windows.net/.default",
            "client_secret": "GKx7816lKrYHMRKrh0rhJDIvEb1Hs55Eh3fF298uarg=",
            "audience": "https://graph.windows.net/"
        };

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        try {
            const response = await axios.post(url, transformRequest(input), config);
            const data = response.data;
            return data.access_token;
        } catch (error) {
            //console.log(error);
            throw error;
        }

    }

    const getUserIdByEmail = async (email, token) => {


        let url = `https://graph.windows.net/pushpb2c.onmicrosoft.com/users?api-version=1.6&$filter=signInNames/any(x:x/value%20eq%20%27${email}%27)`;
        let config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }

        try {
            const response = await axios.get(url, config);
            const data = response.data.value[0];
            return data.objectId;
        } catch (error) {
            //console.log(error);
            throw error;
        }

    }
    
    let authzToken = await getToken();
    let token = `Bearer ${authzToken}`;
    const userId = await getUserIdByEmail(email, authzToken);
    let myUrl = `https://graph.windows.net/pushpb2c.onmicrosoft.com/users/${userId}?api-version=1.6`;

    let config = {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    }
    console.log(config);
    let userData = {
        "passwordProfile": {
                "password": newPassword,
                "forceChangePasswordNextLogin": false  
            }
        };

    try {
        const response = await axios.patch(myUrl, userData, config);
        console.log(response.status);
        return callback(null, true)
    }
    catch (error) {
        //console.log(error.response);
        if(error.response.data && error.response.data["odata.error"] )return callback(new Error(error.response.data["odata.error"].message.value));
        else return callback(null, false);
    }

}


(async () => {
    try {
        const aadToken = await changePassword('pushp.abrol@gmail.com','p', function(err,status){
            console.log(err);
            console.log(status);

        });
        
    } catch (e) {
        // Deal with the fact the chain failed
        console.log(e);
    }
})();
