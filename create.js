async function create(user, callback) {

    const transformRequest = (jsonData = {}) =>Object.entries(jsonData).map(x => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`).join('&');
    const axios = require("axios");
    const getToken = async () => {
    
        const url = "https://login.microsoftonline.com/pushpb2c.onmicrosoft.com/oauth2/v2.0/token";

    const input = { 
        "grant_type": "client_credentials",
        "client_id": "aef09705-7ba3-45d8-867c-468311736193",
        "scope": "https://graph.windows.net/.default",
        "client_secret": "GKx7816lKrYHMRKrh0rhJDIvEb1Hs55Eh3fF298uarg=",
        "audience": "https://graph.windows.net/" };

        const config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }

      try {
        const response = await axios.post(url, transformRequest(input),config );
        const data = response.data;
        return data.access_token;
      } catch (error) {
        //console.log(error);
        throw error;
      }
    
    }


    const myUrl = "https://graph.windows.net/pushpb2c.onmicrosoft.com/users?api-version=1.6";

    let token = `Bearer ${await getToken()}`;
    console.log(token);
    let config = {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      }
    console.log(config);
    let userData = {
        "accountEnabled": true,
        "signInNames": [                           
            {
                "type": "emailAddress",            
                "value": user.email
            }
        ],
        "creationType": "LocalAccount",            
        "displayName": user.email,             
        "mailNickname": user.email.split('@')[0],                    
        "passwordProfile": {
            "password": user.password,
            "forceChangePasswordNextLogin": false  
        },
        "passwordPolicies": "DisablePasswordExpiration"
    };

    try {
            const response = await axios.post(myUrl, userData,config );
            const data = response.data;
            return callback(null)
        }
        catch (error) {
            if(error.response.data && error.response.data["odata.error"] )return callback(new ValidationError("signup_error", error.response.data["odata.error"].message.value));
            else return callback(error);
        }
  }

  (async () => {
    try {
      await create( { email: 'pushp.abrol4@auth0.com', password: 'whats4@me'}, function(err){
            console.log(err);
        });

        
        
    } catch (e) {
        // Deal with the fact the chain failed
        console.log(e);
    }
})();
  