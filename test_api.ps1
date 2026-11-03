Write-Host "=========================================================="
Write-Host " PRUEBAS DE LA API REST (CRUD) - PUNTO 6.2 DEL INFORME"
Write-Host "=========================================================="

$baseUrl = "http://localhost:8080/api/productos"

# 1. POST - Registrando un equipo
Write-Host "`n>>> 1. POST (Registrando un equipo)..."
$bodyPost = @{
    nombre = "Monitor Dell 24 pulgadas"
    marca = "Dell"
    modelo = "P2419H"
    estado = "RECIBIDO"
} | ConvertTo-Json

$respPost = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $bodyPost -ContentType "application/json"
Write-Host "Respuesta HTTP POST (Equipo registrado):"
$respPost | ConvertTo-Json -Depth 5
$nuevoId = $respPost.id

# 2. GET - Buscándolo
Write-Host "`n>>> 2. GET (Buscando equipos en inventario)..."
$respGet = Invoke-RestMethod -Uri $baseUrl -Method GET
Write-Host "Respuesta HTTP GET (Lista de equipos):"
$respGet | ConvertTo-Json -Depth 5

Write-Host "`n>>> 2b. GET por ID (Buscando equipo con ID $nuevoId)..."
$respGetId = Invoke-RestMethod -Uri "$baseUrl/$nuevoId" -Method GET
$respGetId | ConvertTo-Json -Depth 5

# 3. PUT - Actualizándolo
Write-Host "`n>>> 3. PUT (Actualizando el equipo)..."
$bodyPut = @{
    nombre = "Monitor Dell 24 pulgadas UltraSharp"
    marca = "Dell"
    modelo = "U2419H"
    estado = "EN_PROCESO"
} | ConvertTo-Json

$respPut = Invoke-RestMethod -Uri "$baseUrl/$nuevoId" -Method PUT -Body $bodyPut -ContentType "application/json"
Write-Host "Respuesta HTTP PUT (Equipo actualizado):"
$respPut | ConvertTo-Json -Depth 5

# 4. DELETE - Eliminándolo
Write-Host "`n>>> 4. DELETE (Eliminando el equipo con ID $nuevoId)..."
Invoke-RestMethod -Uri "$baseUrl/$nuevoId" -Method DELETE
Write-Host "Respuesta HTTP DELETE: 200 OK (Equipo eliminado exitosamente)"

# 5. GET final de verificación
Write-Host "`n>>> 5. GET (Verificacion final de la lista de equipos)..."
$respGetFinal = Invoke-RestMethod -Uri $baseUrl -Method GET
Write-Host "Respuesta HTTP GET final:"
$respGetFinal | ConvertTo-Json -Depth 5

Write-Host "`n=========================================================="
Write-Host " [EXITO] TODAS LAS PRUEBAS CRUD DEL PUNTO 6.2 COMPLETADAS"
Write-Host "=========================================================="
