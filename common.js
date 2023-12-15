
const transformRequest = (jsonData = {}) =>
Object.entries(jsonData)
  .map(x => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`)
  .join('&');

getToken = async () => {
    const axios = require("axios");
    const url = "https://login.microsoftonline.com/pushpb2c.onmicrosoft.com/oauth2/v2.0/token";

    var input = { 
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

(async () => {
    try {
        const aadToken = await getToken();
        
    } catch (e) {
        // Deal with the fact the chain failed
        console.log(e);
    }
})();



