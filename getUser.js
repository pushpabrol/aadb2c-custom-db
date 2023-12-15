async function getByEmail(email, callback) {
  

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
        };

        try {
            const response = await axios.post(url, transformRequest(input), config);
            const data = response.data;
            return data.access_token;
        } catch (error) {
            //console.log(error);
            throw error;
        }

    };

        const token = await getToken();
        console.log(token);
        
        let url = `https://graph.windows.net/pushpb2c.onmicrosoft.com/users?api-version=1.6&$filter=signInNames/any(x:x/value%20eq%20%27${email}%27)`;
        let config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }

        try {
            const response = await axios.get(url, config);
            let data;
            response.status === 200 && response.data.value.length > 0 ? data = response.data.value[0] : data = null;
            if(data !== null) return callback(null,
                { 
                    user_id : data.objectId,
                    email:  email,
                    name: data.displayName,
                    family_name: data.surname,
                    given_name: data.givenName,
                    nickname: data.displayName,
                    email_verified: true
                });
            else return callback(null);
        } catch (error) {
            return callback(error);
        }

    

    
  }
  
  