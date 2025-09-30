const fs = require('fs');
const path = require('path');

const getSSLOptions = () => {
  try {
    const certPath = path.join(__dirname, '..', 'certs', 'cert.pem');
    const keyPath = path.join(__dirname, '..', 'certs', 'key.pem');
    
    // Verificar que los archivos existen
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      return {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };
    } else {
      console.warn('⚠️  Certificados SSL no encontrados. El servidor se ejecutará en HTTP.');
      return null;
    }
  } catch (error) {
    console.error('❌ Error al cargar certificados SSL:', error.message);
    return null;
  }
};

module.exports = { getSSLOptions };
