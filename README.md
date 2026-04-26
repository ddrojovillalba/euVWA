# euVWA - UE Vulnerable Web Application

Aplicación web vulnerable inspirada en DVWA, desarrollada en Node.js y
Express.

Incluye dos versiones: - main-vulnerable: contiene vulnerabilidades
intencionadas - main-secure: contiene las mismas funcionalidades con
mitigaciones aplicadas

------------------------------------------------------------------------

## Instalación

    git clone https://github.com/ddrojovillalba/euVWA.git
    cd euVWA
    npm install

------------------------------------------------------------------------

## Ejecución

Versión vulnerable:

    git checkout main-vulnerable
    node app.js

Versión segura:

    git checkout main-secure
    node app.js

Servidor: http://localhost:3000

------------------------------------------------------------------------

## Vulnerabilidades implementadas

  -----------------------------------------------------------------------------
  Vulnerabilidad     Endpoint    Descripción              Solución aplicada
  ------------------ ----------- ------------------------ ---------------------
  SQL Injection      /user       Inyección mediante       Validación de entrada
                                 parámetros               

  XSS reflejado      /search     Inyección de scripts     Escape de HTML

  XSS almacenado     /comments   Persistencia de scripts  Sanitización de datos

  Command Injection  /ping       Ejecución de comandos    Validación estricta
                                 del sistema              

  Insecure File      /upload     Subida sin control       Validación de tipo
  Upload                                                  

  Broken             /login      Autenticación débil      Mejora de control
  Authentication                                          

  Sensitive Data     /profile    Exposición de datos      Eliminación de datos
  Exposure                       sensibles                

  Security           /config     Errores visibles         Manejo de errores
  Misconfiguration                                        
  -----------------------------------------------------------------------------

------------------------------------------------------------------------

## Ejemplos de explotación

SQL Injection:

    /user?username=' OR '1'='1

XSS reflejado:

    /search?q=<script>alert('XSS')</script>

XSS almacenado:

    /comment?comment=<script>alert('XSS')</script>

Command Injection:

    /ping?ip=127.0.0.1 && dir

File Upload: Subir archivo HTML con:

    <script>alert('XSS')</script>

------------------------------------------------------------------------

## Tecnologías

-   Node.js
-   Express
-   Multer

------------------------------------------------------------------------

## Autor

David Rojo Villalba