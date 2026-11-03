$env:JAVA_HOME = "C:\Users\baranda2\jdk-21"
$env:Path = "C:\Users\baranda2\jdk-21\bin;C:\Users\baranda2\maven\bin;$env:Path"

Set-Location "c:\Users\baranda2\OneDrive - SEIDOR SOLUTIONS S.L\Documentos\Proyecto"
& .\mvnw.cmd compile spring-boot:run "-Dspring-boot.run.profiles=h2"
