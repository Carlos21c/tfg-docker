# Mi proyecto de TFG dockerizado
Este proyecto se trata de una aplicación completa que contiene: 
- Base de datos (PostgreSQL)
- Back end (Spring boot)
- Front end (Angular)
# Requisitos para su uso 
- Docker
- Docker compose
# Como ejecutar el contenedor
Para poder hacer uso de la aplicación se debe modificar el fichero mvnw contenido en la carpeta "WebApp" que se corresponde a la parte del back end, convirtiendo el caracter de fin de línea de Windows al caracter de fin de línea de Ubuntu. Una vez que se haya modificado el fichero, además de asegurarnos que Docker está funcionando en nuestro sistema, se deberá crear el contenedor con el comando:
```shell
docker-compose up --build
```
Una vez que se hayan levantado todos los contenedores habrá que utilizar la copia de la base de datos. Para utilizar esta copia primero habrá que copiarla dentro del contenedor con el comando:
```shell
docker cp "ruta/del/fichero/dump/descargado" db:/tfg_defecto.dump
```
Con la copia realizada dentro del contenedor habrá que acceder a dicho contenedor, para esto se debe hacer uso del comando:
```shell
docker exec -it db bash
```
Una vez dentro se deberán restaurar los datos, esto se llevará a cabo con el comando:
```shell
pg_restore -U postgres -d TFG /tfg_defecto.dump
```
Con esto cada vez que se inicie el contenedor se dispondrán de las provincias, los municipios y los tipos de cultivo.
