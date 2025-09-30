# Inndex

Repositorio para el proyecto **Growing Index**.

---

## 📦 Requisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado:
- **Node.js**
- **Supabase**
---

## 🛠️ Instalación

1. **Clona este repositorio:**

   ```bash
   git clone <URL-del-repositorio>
   cd <nombre-del-repositorio>
   ```

2. **Instala las dependencias del Backend:**

   ```bash
   cd Backend
   npm install
   ```

3. **Instala las dependencias del Frontend:**

   ```bash
   cd Frontend
   npm install
   ```

4. **Configura las variables de entorno**

   Crea un archivo `.env` en la raíz del Backend con el siguiente contenido:

   ```env
   SUPABASE_URL=<tu_supabase_url>
   SUPABASE_ANON_KEY=<tu_supabase_anon_key>
   SUPABASE_SERVICE_ROLE_KEY=<tu_supabase_service_role_key>
   MAILERSEND_API_KEY=<tu_mailersend_api_key>
   FROM_EMAIL=<tu_email>
   BASE_URL=http://localhost:5173
   ```

Crea un archivo `.env` en la raíz del Frontend con el siguiente contenido:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

---

## 🚀 Ejecución

1. **Inicia el Frontend:**

   ```bash
   cd Frontend
   npm run dev
   ```

2. **Inicia el Backend:**

   ```bash
   cd Backend
   node server.js
   ```

3. **Inicia el servicio de MailSender (opcional):**

   ```bash
   cd Backend
   node mail/mailSender.js
   ```

---


## 🗂️ Estructura del Proyecto

La estructura principal del repositorio es la siguiente:

```
/
├── Backend/         # Código fuente y configuración del backend (API, lógica de negocio, conexión a BD)
│   ├── mail/        # Servicios relacionados con el envío de correos
│   ├── server.js    # Punto de entrada principal del backend
│   └── ...          # Otros archivos y carpetas del backend
├── Frontend/        # Aplicación frontend (React + Vite + TailwindCSS)
│   ├── src/         # Código fuente del frontend
│   ├── public/      # Archivos estáticos
│   ├── package.json # Dependencias y scripts del frontend
│   └── ...          # Otros archivos y carpetas del frontend
├── README.md        # Documentación principal del proyecto
└── ...              # Otros archivos de configuración y documentación
```

## 📄 Notas


- Reemplaza los valores de las variables de entorno por los datos reales de tus servicios.
- Si tienes dudas, revisa la documentación de cada dependencia o abre un issue.

---