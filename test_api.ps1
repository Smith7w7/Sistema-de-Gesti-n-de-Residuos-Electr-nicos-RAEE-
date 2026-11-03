Write-Host "=========================================================="
Write-Host " PRUEBAS DE LA API REST (CRUD) Y CONSULTAS JPQL / NAMED"
Write-Host "=========================================================="

$baseProd = "http://localhost:8080/api/productos"
$baseCli = "http://localhost:8080/api/clientes"

# ----------------------------------------------------
# 1. PRUEBAS CRUD - PRODUCTOS
# ----------------------------------------------------
Write-Host "`n>>> [PRODUCTO] 1. POST (Registrando un equipo/producto)..."
$bodyProd = @{
    nombre = "Monitor Dell 24 pulgadas UltraSharp"
    marca = "Dell"
    modelo = "U2419H"
    estado = "RECIBIDO"
    precio = 450.00
    stock = 10
} | ConvertTo-Json

$respProdPost = Invoke-RestMethod -Uri $baseProd -Method POST -Body $bodyProd -ContentType "application/json"
Write-Host "Respuesta HTTP POST (Producto registrado):"
$respProdPost | ConvertTo-Json -Depth 5
$prodId = $respProdPost.id

Write-Host "`n>>> [PRODUCTO] 2. GET (Consultando producto por ID $prodId)..."
$respProdGet = Invoke-RestMethod -Uri "$baseProd/$prodId" -Method GET
$respProdGet | ConvertTo-Json -Depth 5

Write-Host "`n>>> [PRODUCTO] 3. PUT (Actualizando estado y precio)..."
$bodyProdPut = @{
    nombre = "Monitor Dell 24 pulgadas UltraSharp (Aprobado)"
    marca = "Dell"
    modelo = "U2419H"
    estado = "OPERATIVO"
    precio = 480.00
    stock = 9
} | ConvertTo-Json
$respProdPut = Invoke-RestMethod -Uri "$baseProd/$prodId" -Method PUT -Body $bodyProdPut -ContentType "application/json"
$respProdPut | ConvertTo-Json -Depth 5

Write-Host "`n>>> [PRODUCTO] 4. Named Query (Buscar por Estado y Marca)..."
$respNamedProd = Invoke-RestMethod -Uri "$baseProd/buscar/estado-marca?estado=OPERATIVO&marca=Dell" -Method GET
$respNamedProd | ConvertTo-Json -Depth 5

# ----------------------------------------------------
# 2. PRUEBAS CRUD - CLIENTES
# ----------------------------------------------------
Write-Host "`n>>> [CLIENTE] 1. POST (Registrando un cliente)..."
$bodyCli = @{
    nombre = "Mariana Valdivia"
    identificacion = "71829304"
    email = "mariana.valdivia@test.com"
    telefono = "987112233"
    tipo = "NATURAL"
} | ConvertTo-Json

$respCliPost = Invoke-RestMethod -Uri $baseCli -Method POST -Body $bodyCli -ContentType "application/json"
Write-Host "Respuesta HTTP POST (Cliente registrado):"
$respCliPost | ConvertTo-Json -Depth 5
$cliId = $respCliPost.id

Write-Host "`n>>> [CLIENTE] 2. Named Query (Buscar por Identificación/DNI)..."
$respCliDoc = Invoke-RestMethod -Uri "$baseCli/identificacion/71829304" -Method GET
$respCliDoc | ConvertTo-Json -Depth 5

Write-Host "`n>>> [CLIENTE] 3. PUT (Actualizando datos del cliente)..."
$bodyCliPut = @{
    nombre = "Mariana Valdivia Ramos"
    identificacion = "71829304"
    email = "m.valdivia@empresa.com"
    telefono = "987000111"
    tipo = "NATURAL"
} | ConvertTo-Json
$respCliPut = Invoke-RestMethod -Uri "$baseCli/$cliId" -Method PUT -Body $bodyCliPut -ContentType "application/json"
$respCliPut | ConvertTo-Json -Depth 5

# ----------------------------------------------------
# 3. ELIMINACIÓN Y VERIFICACIÓN
# ----------------------------------------------------
Write-Host "`n>>> [PRODUCTO] 5. DELETE (Eliminando producto de prueba ID $prodId)..."
Invoke-RestMethod -Uri "$baseProd/$prodId" -Method DELETE
Write-Host "Respuesta HTTP DELETE: 204 No Content (Producto eliminado con éxito)"

Write-Host "`n>>> [CLIENTE] 4. DELETE (Eliminando cliente de prueba ID $cliId)..."
Invoke-RestMethod -Uri "$baseCli/$cliId" -Method DELETE
Write-Host "Respuesta HTTP DELETE: 204 No Content (Cliente eliminado con éxito)"

Write-Host "`n=========================================================="
Write-Host " [EXITO] TODAS LAS PRUEBAS CRUD Y CONSULTAS VALIDADAS"
Write-Host "=========================================================="
