# Growinn Backend Server

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Ejecutar servidor (HTTP + HTTPS)
node server.js
```

## 🔧 Configuración

### Puertos Disponibles
- **HTTP**: `http://localhost:3000` - Para compatibilidad con frontend actual
- **HTTPS**: `https://localhost:3443` - Para conexiones seguras

### Variables de Entorno
Copia `.env.example` a `.env` y configura las variables necesarias.

## 🛡️ Seguridad Implementada

### ✅ Características de Seguridad
- **HTTPS** con certificados SSL auto-firmados para desarrollo
- **CORS** configurado para permitir orígenes específicos
- **Helmet** para headers de seguridad HTTP
- **Validación de entrada** en todos los endpoints
- **Rate limiting** implícito via Express
- **Sanitización** de datos de entrada

### 🔒 Headers de Seguridad
- `X-Frame-Options`: Previene clickjacking
- `X-Content-Type-Options`: Previene MIME sniffing
- `X-XSS-Protection`: Protección XSS del navegador
- `Strict-Transport-Security`: Fuerza HTTPS
- `Content-Security-Policy`: Controla recursos permitidos

## 📡 Endpoints Disponibles

### Empresas
- `GET /empresas` - Obtener todas las empresas
- `POST /empresas` - Crear nueva empresa

### Áreas
- `GET /areas/empresa/:empresaId` - Obtener áreas por empresa
- `GET /areas/:id` - Obtener área por ID
- `POST /areas` - Crear nueva área
- `PUT /areas/:id` - Actualizar área
- `DELETE /areas/:id` - Eliminar área

### Cargos
- `GET /cargos` - Obtener todos los cargos
- `POST /cargos` - Crear nuevo cargo
- `PUT /cargos/:id` - Actualizar cargo
- `DELETE /cargos/:id` - Eliminar cargo

### Subcargos
- `GET /subcargos` - Obtener todos los subcargos
- `GET /subcargos/cargo/:cargoId` - Obtener subcargos por cargo
- `POST /subcargos` - Crear nuevo subcargo
- `PUT /subcargos/:id` - Actualizar subcargo
- `DELETE /subcargos/:id` - Eliminar subcargo

### Usuarios
- `GET /usuarios` - Obtener todos los usuarios

## 🔍 Verificación

Para verificar que el servidor funciona:

```bash
# HTTP
curl http://localhost:3000/empresas

# HTTPS (ignorar certificado auto-firmado)
curl -k https://localhost:3443/empresas
```

## 📝 Notas de Desarrollo

- Los certificados SSL son auto-firmados y válidos por 365 días
- Para producción, reemplazar con certificados válidos de una CA
- El servidor mantiene compatibilidad con HTTP para facilitar la transición
- Todos los endpoints devuelven JSON con manejo de errores consistente

## 🚨 Advertencias de Navegador

Al acceder a HTTPS con certificados auto-firmados, los navegadores mostrarán advertencias de seguridad. Esto es normal en desarrollo.

Para aceptar:
- **Chrome/Edge**: "Avanzado" → "Proceder a localhost (no seguro)"
- **Firefox**: "Avanzado" → "Aceptar el riesgo y continuar"
