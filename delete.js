function removefromAuth0(id, callback) {
    // This script remove a user from your existing database.
    // It is executed whenever a user is deleted from the API or Auth0 dashboard.
    //
    // There are two ways that this script can finish:
    // 1. The user was removed successfully:
    //     callback(null); - if you just return this it will be removed from auth0 only
    // 2. Something went wrong while trying to reach your database:
    //     callback(new Error("my error message"));
  
    return callback(null);
  }
  