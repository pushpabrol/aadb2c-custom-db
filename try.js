//https://pushpb2c.b2clogin.com/pushpb2c.onmicrosoft.com/oauth2/v2.0/token

const transformRequest = (jsonData = {}) => Object.entries(jsonData).map(x => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`).join('&');
const axios = require("axios");

(async () => {



    try {

        const url = "https://login.microsoftonline.com/pushpb2c.onmicrosoft.com/oauth2/v2.0/token";

        const input = {
            "grant_type": "client_credentials",
            "client_id": "aef09705-7ba3-45d8-867c-468311736193",
            "scope": "https://graph.windows.net/.default",
            "client_secret": "GKx7816lKrYHMRKrh0rhJDIvEb1Hs55Eh3fF298uarg=",
            "audience": "https://graph.windows.net/"
        };
    
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        const response = await axios.post(url, transformRequest(input), config);
        const data = response.data;
        console.log(data);
        
        var email = "pushp.abrol@gmail.com";
        let graphUrl = `https://graph.windows.net/pushpb2c.onmicrosoft.com/users?api-version=1.6&$filter=signInNames/any(x:x/value%20eq%20%27${email}%27)`;
        config = {
            headers: {
                'Authorization': `Bearer ${data.access_token}`,
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.get(graphUrl, config);
            console.log(res);
            let data;
            res.status === 200 && res.data.value.length > 0 ? data = res.data.value[0] : data = null;
            console.log(data);

        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        console.log(error);
    }
})();
