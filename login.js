async function login(email, password, callback) {
  
  var jwt = require('jsonwebtoken');
  var request = require("request");
  const axios = require("axios");
  // set the URL
  const url = "https://pushpb2c.b2clogin.com/pushpb2c.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_ropc_auth";
  // set the client ID
  const clientID = "";
  const scope = `openid ${clientID} profile`
  
  const transformRequest = (jsonData = {}) => Object.entries(jsonData).map(x => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`).join('&');

var input = { 
  client_id: clientID,
  scope: scope,
  username: email,
  password: password,
  grant_type: 'password',
  response_type: 'token id_token' 
   };

 const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

  try {
    const response = await axios.post(url, transformRequest(input),config );
    const data = response.data;
    var decoded = jwt.decode(data.id_token);
    console.log(decoded);
    var profile = { id : decoded.sub};
    profile.emails = decoded.emails;
    profile.name = decoded.name; 
    profile.user_metadata = {};
    profile.user_metadata.given_name = decoded.given_name;
    profile.user_metadata.family_name = decoded.family_name;
    console.log(profile);
    return callback(null, profile, callback);
  } catch (error) {
      console.log(error);
      return callback(new WrongUsernameOrPasswordError(email, error.error_description));

  }

}

