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
    "HUB_HOST": "<hub>"
  }
}
```
## Send the requests via the desired {file}.http

__service/{file}.http__  _(Examples for calling the API)_

1. Use Case 1 - Provision Devices in Bulk using DPS CA
2. Use Case 2 - Provision Devices in Bulk using Symmetric Key
3. Use Case 3 - Provision 2 Individual Devices 1 Using TPM and the other Symmetric Key
