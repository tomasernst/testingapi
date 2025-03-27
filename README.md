# Galapagos Testing API

API para probar el mecanismo de sincronización de Buk sin necesitar la API real de Galápagos.

## Requisitos

- Node.js (version 12 o superior)
- npm

## Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd testing-api
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```
   
3. **Correr el servidor de desarrollo**

   ```bash
   npm run dev
   ```
   
## Documentación

### GET /api/v1/instances

Retorna todas las instancias registradas.
```bash
http://localhost:3000/api/v1/instances?host=tenant1.buk.cl
```

### GET /api/v1/instances?host={tenant}
Retorna las instancias filtradas por el valor del parámetro host.
```bash
http://localhost:3000/api/v1/instances?host=tenant1.buk.cl
```


