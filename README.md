# SERVIDOR APIRest 

APIRest implementado en node.js con framework express y base de datos mongoDB, permite el CRUD de los datos almacenados.
## Instalación

Para instalar las depencencias del servidor correr el siguiente comando en la carpeta [Directorio local]\Gestion-de-feriados-servidor:

```bash
npm install
```

## Iniciar el servidor

```bash
npm start
```


El servidor comenzará a escuchar en el puerto 5000 y se conectará con las bases de datos en mongoDB de Usuarios y Feriados.

Posee endpoints para realizar el CRUD de los datos almacenados, y rutas seguras con autenticación por medio de JWT para eliminar, editar o crear un feriado.
