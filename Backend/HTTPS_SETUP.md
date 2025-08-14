# Configuración HTTPS para Growinn Backend

## 🔒 Mejoras de Seguridad Implementadas

### 1. HTTPS con Certificados SSL
- El servidor ahora utiliza certificados SSL para conexiones HTTPS
- Certificados auto-firmados generados para desarrollo local
- Redirección automática de HTTP a HTTPS

### 2. Middlewares de Seguridad
- **Helmet**: Configurado para establecer headers de seguridad HTTP
- **CORS**: Actualizado para soportar orígenes HTTPS
- **Content Security Policy**: Configurado para prevenir ataques XSS
- **HSTS**: Headers de seguridad de transporte estricto

### 3. Configuración del Servidor
- Soporte dual HTTP/HTTPS con fallback automático
- Redirección de HTTP a HTTPS en puerto 8080
- Límite de tamaño de payload JSON (10MB)

## 🚀 Cómo Usar

### Desarrollo Local
```bash
# Instalar dependencias
npm install

# Generar certificados SSL (ya ejecutado)
npm run generate-certs

# Ejecutar en modo desarrollo
npm run dev
```

### URLs de Acceso
- **HTTP (Compatibilidad)**: `http://localhost:3000`
- **HTTPS (Seguro)**: `https://localhost:3443`

### Certificados SSL
Los certificados están ubicados en:
- Certificado: `./certs/cert.pem`
- Clave privada: `./certs/key.pem`
- Válidos por: 365 días

## ✅ Estado del Servidor
El servidor ahora funciona con:
- ✅ CORS configurado correctamente
- ✅ HTTP en puerto 3000 (para compatibilidad con frontend actual)
- ✅ HTTPS en puerto 3443 (para conexiones seguras)
- ✅ Headers de seguridad con Helmet
- ✅ Middlewares organizados correctamente

## ⚠️ Advertencias del Navegador

Al usar certificados auto-firmados en desarrollo, los navegadores mostrarán una advertencia de seguridad. Esto es normal y puedes:

1. **Chrome/Edge**: Hacer clic en "Avanzado" → "Proceder a localhost (no seguro)"
2. **Firefox**: Hacer clic en "Avanzado" → "Aceptar el riesgo y continuar"

## 🔧 Configuración de Producción

Para producción, reemplaza los certificados auto-firmados con certificados válidos de una CA (Certificate Authority) como:
- Let's Encrypt (gratuito)
- DigiCert
- Comodo

### Variables de Entorno
Copia `.env.example` a `.env` y configura:
```env
NODE_ENV=production
PORT=443
SSL_CERT_PATH=/ruta/a/certificado/produccion.pem
SSL_KEY_PATH=/ruta/a/clave/produccion.pem
```

## 🛡️ Headers de Seguridad Configurados

- **X-Frame-Options**: Previene clickjacking
- **X-Content-Type-Options**: Previene MIME sniffing
- **X-XSS-Protection**: Protección XSS del navegador
- **Strict-Transport-Security**: Fuerza HTTPS
- **Content-Security-Policy**: Controla recursos permitidos

## 📋 Frontend - Actualización Necesaria

El frontend puede seguir usando HTTP durante la transición:
```javascript
// Actual (funciona)
const API_URL = 'http://localhost:3000';

// Para mayor seguridad (futuro)
const API_URL = 'https://localhost:3443';
```

### Configuración Recomendada en Frontend
```javascript
// Configuración dual para transición gradual
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://localhost:3443'  // HTTPS en producción
  : 'http://localhost:3000';   // HTTP en desarrollo

// O configuración con fallback
const API_URLs = [
  'https://localhost:3443', // Intentar HTTPS primero
  'http://localhost:3000'   // Fallback a HTTP
];
```

## 🔍 Verificación

Para verificar que HTTPS funciona correctamente:
```bash
curl -k https://localhost:3000/empresas
```

El flag `-k` ignora los errores de certificado auto-firmado.
