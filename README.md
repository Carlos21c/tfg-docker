# Mi proyecto de TFG dockerizado
Este proyecto se trata de una aplicación completa que contiene: 
- Base de datos (PostgreSQL)
- Back end (Spring boot)
- Front end (Angular)
# Requisitos para su uso 
- Docker
- Docker compose
# Como ejecutar el contenedor
Para poder hacer uso de la aplicación se debe modificar el fichero mvnw contenido en la carpeta "WebApp" que se corresponde a la parte del back end, convirtiendo el caracter de fin de línea de Windows al caracter de fin de línea de Ubuntu. Una vez realizado esto simplemente se podrá ejecutar la aplicación con el comando "docker-compose up --build".
Una vez que se hayan levantado todos los contenedores habrá que utilizar la copia de la base de datos. Para utilizar esta copia primero habrá que copiarla dentro del contenedor con el comando "docker cp "ruta/del/fichero/dump/descargado" db:/tfg_defecto.dump".
Con la copia realizada dentro del contenedor habrá que acceder a dicho contenedor, esto se realizará con el comando "docker exec -it db bash". Una vez dentro se deberán restaurar los datos, para ello se usará el comando "pg_restore -U postgres -d TFG /tfg_defecto.dump". Con esto cada vez que se inicie el contenedor se dispondrán de las provincias, los municipios y los tipos de cultivo.   
