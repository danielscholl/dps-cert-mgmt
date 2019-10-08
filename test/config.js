'use strict';

module.exports = {
  id: process.env.ARM_CLIENT_ID,
  secret: process.env.ARM_CLIENT_SECRET,
  host: process.env.AUTH_HOST || 'https://login.microsoftonline.com',
  tenant: process.env.ARM_TENANT_ID
}
