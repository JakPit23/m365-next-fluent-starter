# --- Configuration ---
# --- Feel free to change these values as needed ---
$appName = "MyApp"
$redirectUri = "http://localhost:3000/api/auth/callback/microsoft"

$graphResourceId = "00000003-0000-0000-c000-000000000000"
$permUserRead = "e1fe6dd8-ba31-4d61-89e7-88639da4683d"
$permUserReadAll = "a154be20-db9c-4678-8ab7-66f6cc099a59"
$baseUrl = "http://localhost:3000"
Write-Host "[INFO] Creating Entra ID App..."

# 0. Prerequisites check
try {
az --version > $null
} catch {
    Write-Host "[ERROR] Azure CLI is not installed. Please install it from https://aka.ms/cli." -ForegroundColor Red
    exit 1
}

# Enter the base URL for your app (e.g., http://localhost:3000)
$baseUrlInput = Read-Host "Enter the base URL for your app (default: $baseUrl)"
if ($baseUrlInput -ne "") {
    $baseUrl = $baseUrlInput
    $redirectUri = "$baseUrl/api/auth/callback/microsoft"
}
# 1. Auth check
$azAccount = az account show --query "user.name" -o tsv
if ($null -eq $azAccount) {
    Write-Host "[ERROR] Azure CLI is not logged in. Running az login..." -ForegroundColor Red
    az login
}

# 2. Application Registration
Write-Host "[1/4] Creating app..."
$appJson = az ad app create --display-name $appName --web-redirect-uris $redirectUri --sign-in-audience AzureADMultipleOrgs --query "{appId:appId, objectId:id}" -o json | ConvertFrom-Json
$clientId = $appJson.appId
$objectId = $appJson.objectId

# 3. Permissions
Write-Host "[2/4] Configuring API Permissions (User.Read, User.Read.All)..."
az ad app permission add --id $clientId --api $graphResourceId --api-permissions "$($permUserRead)=Scope" "$($permUserReadAll)=Scope"
# 4. Credentials
Write-Host "[3/4] Generating client secret..."
$secretJson = az ad app credential reset --id $clientId --append --display-name "ProductionSecret" --query "{password:password, tenant:tenant}" -o json | ConvertFrom-Json
$clientSecret = $secretJson.password
$tenantId = $secretJson.tenant

# 5. Environment Setup
Write-Host "[4/4] Generating .env.local..."
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::Create()
$rng.GetBytes($bytes)
$baSecret = [Convert]::ToBase64String($bytes)
$envContent = @"
ENTRA_CLIENT_ID=$clientId
ENTRA_CLIENT_SECRET=$clientSecret
ENTRA_TENANT_ID=$tenantId
BETTER_AUTH_SECRET=$baSecret
BETTER_AUTH_URL=$baseUrl
DATABASE_URL="file:./dev.db"
"@

$envContent | Out-File -FilePath ".env.local" -Encoding utf8

Write-Host "---------------------------------------------------"
Write-Host "Registration complete" -ForegroundColor Green
Write-Host "App ID: $clientId"
Write-Host "Tenant ID: $tenantId"
Write-Host "---------------------------------------------------"
Write-Host "NOTE: Admin consent required in Azure portal."
