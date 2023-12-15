
# Auth0 Custom Database Connection with Migration for Azure AD B2C

## Overview
This README provides guidance on setting up and using a custom database connection with Auth0, with a focus on enabling user migration. This is particularly useful for applications transitioning from a legacy user database to Auth0 while ensuring a seamless user experience.

## Prerequisites
- An Auth0 account.
- Access to the legacy user database.
- Basic knowledge of database operations and Auth0 rules.

## Setting Up the Custom Database
1. **Create a Database Connection in Auth0:**
   - Navigate to the Auth0 Dashboard.
   - Go to `Connections` -> `Database` and click `Create DB Connection`.
   - Enter the name for the connection and click `Create`.

2. **Enable Custom Database:**
   - In the settings of your new database connection, toggle the `Custom Database` option to `on`.
   - This allows you to input your own database scripts.

3. **Configure Database Action Scripts:**
   - You will need to provide scripts for various database actions, like `login`, `getUser`, `delete`, etc.
   - These scripts are written in JavaScript and interact with your database.

## Enabling Migration
1. **Toggle the Migration Setting:**
   - Within your database connection settings, find the `Migrate User` toggle and turn it on.
   - This enables Auth0 to handle user migration from your old database to Auth0.

2. **Configure Migration Scripts:**
   - Provide a `login` script for migrating users upon first login.
   - Optionally, add a `getUser` script to import users who haven't logged in yet.

## Testing
- Test your database connection and migration scripts using the Auth0 dashboard.
- Ensure the scripts are correctly interacting with your legacy database and migrating users as expected.
- before testing via dashboard make sure at least one app is enabled to use this connection

## Security Considerations
- Always use secure methods to connect to your database.
- Avoid logging sensitive information in your scripts.
- Regularly review and update your database access credentials.

## Troubleshooting
- Verify database connectivity and credentials.
- Check for errors in the Auth0 logs.
- Ensure your scripts correctly match your database schema.

## Additional Resources
- [Auth0 Custom Database Documentation](https://auth0.com/docs/connections/database/custom-db)
- [Auth0 Management API](https://auth0.com/docs/api/management/v2)

## Support
For issues and questions, contact Auth0 support or refer to the Auth0 community forums.

---

This template is a starting point. You should customize it based on your specific database configuration, the programming language used for your scripts, and any other relevant details about your environment.