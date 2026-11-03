Write-Host "=========================================================="
Write-Host " PRUEBAS DE LA API REST - SEGURIDAD JWT, ROLES Y CRUD"
Write-Host "=========================================================="

$authUrl = "http://localhost:8080/api/auth/login"
$baseProd = "http://localhost:8080/api/productos"
$baseCli = "http://localhost:8080/api/clientes"

# ----------------------------------------------------
# 1. PRUEBA DE SEGURIDAD: ACCESO SIN TOKEN (DEBE FALLAR 403)
# ----------------------------------------------------
Write-Host "`n>>> 1. Intentando acceder a /api/productos sin Token JWT..."
try {
    Invoke-RestMethod -Uri $baseProd -Method GET
    Write-Host "[ERROR] Se permitió el acceso sin autenticación!" -ForegroundColor Red
} catch {
    Write-Host "[OK] Acceso denegado correctamente (HTTP 403 Forbidden): $($_.Exception.Message)" -ForegroundColor Green
}

# ----------------------------------------------------
# 2. AUTENTICACIÓN COMO ADMINISTRADOR (ROLE_ADMIN)
# ----------------------------------------------------
Write-Host "`n>>> 2. Autenticando como Administrador (admin / admin123)..."
$bodyLoginAdmin = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$respAdmin = Invoke-RestMethod -Uri $authUrl -Method POST -Body $bodyLoginAdmin -ContentType "application/json"
$tokenAdmin = $respAdmin.token
Write-Host "Token JWT obtenido con éxito para rol: $($respAdmin.rol)" -ForegroundColor Cyan
Write-Host "Token: $($tokenAdmin.Substring(0, 30))..."

$headersAdmin = @{
    Authorization = "Bearer $tokenAdmin"
}

# ----------------------------------------------------
# 3. CRUD DE PRODUCTO CON VALIDACIÓN (CON TOKEN ADMIN)
# ----------------------------------------------------
Write-Host "`n>>> 3. [ADMIN] Registrando un equipo con validaciones..."
$bodyProd = @{
    nombre = "Switch Cisco Catalyst 2960"
    marca = "Cisco"
    modelo = "WS-C2960-24TT-L"
    estado = "OPERATIVO"
    precio = 650.00
    stock = 4
} | ConvertTo-Json

$respProdPost = Invoke-RestMethod -Uri $baseProd -Method POST -Body $bodyProd -ContentType "application/json" -Headers $headersAdmin
Write-Host "Respuesta HTTP POST (Producto registrado):"
$respProdPost | ConvertTo-Json -Depth 5
$prodId = $respProdPost.id

# ----------------------------------------------------
# 4. SHOW (BUSCAR POR ID) Y UPDATE
# ----------------------------------------------------
Write-Host "`n>>> 4. [ADMIN] Consultando producto (SHOW por ID $prodId)..."
$respProdGet = Invoke-RestMethod -Uri "$baseProd/$prodId" -Method GET -Headers $headersAdmin
$respProdGet | ConvertTo-Json -Depth 5

Write-Host "`n>>> 5. [ADMIN] Actualizando producto (UPDATE)..."
$bodyProdPut = @{
    nombre = "Switch Cisco Catalyst 2960 (Actualizado)"
    marca = "Cisco"
    modelo = "WS-C2960-24TT-L"
    estado = "OPERATIVO"
    precio = 690.00
    stock = 3
} | ConvertTo-Json
$respProdPut = Invoke-RestMethod -Uri "$baseProd/$prodId" -Method PUT -Body $bodyProdPut -ContentType "application/json" -Headers $headersAdmin
$respProdPut | ConvertTo-Json -Depth 5

# ----------------------------------------------------
# 5. CONTROL DE ACCESO POR ROLES (ROLE_VENDEDOR)
# ----------------------------------------------------
Write-Host "`n>>> 6. Autenticando como Vendedor (vendedor / vendedor123)..."
$bodyLoginVend = @{
    username = "vendedor"
    password = "vendedor123"
} | ConvertTo-Json

$respVend = Invoke-RestMethod -Uri $authUrl -Method POST -Body $bodyLoginVend -ContentType "application/json"
$tokenVend = $respVend.token
Write-Host "Token JWT obtenido con éxito para rol: $($respVend.rol)" -ForegroundColor Yellow

$headersVend = @{
    Authorization = "Bearer $tokenVend"
}

Write-Host "`n>>> 7. [VENDEDOR] Intentando eliminar producto ID $prodId (Debe ser denegado 403)..."
try {
    Invoke-RestMethod -Uri "$baseProd/$prodId" -Method DELETE -Headers $headersVend
    Write-Host "[ERROR] El vendedor pudo eliminar el producto!" -ForegroundColor Red
} catch {
    Write-Host "[OK] Operación bloqueada para el rol VENDEDOR (HTTP 403 Acceso Denegado): $($_.Exception.Message)" -ForegroundColor Green
}

# ----------------------------------------------------
# 6. DELETE EXITOSO POR ADMINISTRADOR
# ----------------------------------------------------
Write-Host "`n>>> 8. [ADMIN] Eliminando producto ID $prodId (Debe ser permitido 204)..."
Invoke-RestMethod -Uri "$baseProd/$prodId" -Method DELETE -Headers $headersAdmin
Write-Host "[OK] Producto eliminado exitosamente por el Administrador (HTTP 204 No Content)" -ForegroundColor Green

Write-Host "`n=========================================================="
Write-Host " [EXITO] PRUEBAS DE SEGURIDAD JWT, ROLES Y CRUD FINALIZADAS"
Write-Host "=========================================================="
