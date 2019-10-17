# Executing Device Provisioning Services API

__PreRequisites__

Requires the use of [VS Code](https://code.visualstudio.com/)
Requires the use of the extension [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

## Create a Service Principal

```powershell
$SP_NAME = "DPS-API"
az ad sp create-for-rbac --name $SP_NAME

# Expected Result
{
  "appId": "00000000-0000-0000-0000-000000000000",
  "displayName": "DPS-API",
  "name": "http://DPS-API",
  "password": "0000-0000-0000-0000-000000000000",
  "tenant": "00000000-0000-0000-0000-000000000000"
}
```

## Grant access for the Service Principal

[Provide access](https://docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-data-access) to the Service Principal for the Device Provisioning Service.
>Note: Directions are for TSI but same process should apply.


## Edit VS Code Settings File to store local variables

```json
"rest-client.environmentVariables": {
  "local": {
    "TENANT_ID": "<tenant>",
    "SUBSCRIPTION_ID": "<subscription>",
    "CLIENT_ID": "<appId>",
    "CLIENT_SECRET": "<password>",
    "DPS_HOST" : "<dps>",
    "HUB_HOST": "<hub>",
    "ID_SCOPE": "<dps_scopeId>",
    "DPS_CONNECTIONSTRING": "<provisioningserviceowner_connectionstring>",
    "PRIMARY_KEY": "<primary_key>",
    "SECONDARY_KEY": "<secondary_key>"
  }
}
```
## Send the requests via the desired {file}.http

### API-VERSION = 2019-03-01

1. Use Case 1 -- Individual Enrollement using Symmetric Key
2. Use Case 2 -- Group Enrollment using Symmetric Keys and Derived Keys


### API-VERSION = 2019-05-01

3. Use Case 3 -- Provision Device Using Symmetric Key and new Object Model
4. Use Case 4 -- Provision Device Using TPM and new Object Model
5. Use Case 5 -- Provision Device Using x509 and new Object Model
6. Use Case 6 -- Provision Device using DPS CA and new Object Model
7. Use Case 7 -- Provision Devices in Bulk using Symmetric Key and new Object Model


