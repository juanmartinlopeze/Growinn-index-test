const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

// Función de debugging mejorada
function debugLog(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const prefix = {
    'info': '🔍',
    'success': '✅', 
    'warning': '⚠️',
    'error': '❌',
    'network': '📡',
    'data': '📊'
  }[level] || '📝';
  
  console.log(`${prefix} [${timestamp}] ${message}`);
  if (data) {
    console.log('   Datos:', data);
  }
}

export async function generarExcelDesdeBD(empresaId) {
  debugLog('info', 'INICIO - Generación de Excel', { empresaId, baseUrl: BASE_URL });
  
  try {
    // Validación inicial
    if (!empresaId) {
      throw new Error('ID de empresa no proporcionado');
    }
    
    debugLog('info', 'Validación inicial completada');
    
    // Construcción de URL
    const url = `${BASE_URL}/excel/${empresaId}`;
    debugLog('network', 'URL construida', { url });
    
    // Verificar conectividad básica
    debugLog('network', 'Verificando conectividad...');
    
    // Petición con headers explícitos y timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
    
    try {
      debugLog('network', 'Enviando petición...');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      debugLog('network', 'Respuesta recibida', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        type: response.type,
        url: response.url
      });
      
      // Log de headers de respuesta
      const responseHeaders = {};
      for (let [key, value] of response.headers.entries()) {
        responseHeaders[key] = value;
      }
      debugLog('network', 'Headers de respuesta', responseHeaders);
      
      if (!response.ok) {
        // Intentar obtener el error como JSON primero, luego como texto
        let errorDetail;
        const contentType = response.headers.get('content-type');
        
        try {
          if (contentType && contentType.includes('application/json')) {
            errorDetail = await response.json();
            debugLog('error', 'Error del servidor (JSON)', errorDetail);
          } else {
            errorDetail = await response.text();
            debugLog('error', 'Error del servidor (Texto)', { errorText: errorDetail });
          }
        } catch (parseError) {
          debugLog('error', 'No se pudo parsear el error del servidor', parseError);
          errorDetail = 'Error desconocido del servidor';
        }
        
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}\nDetalle: ${JSON.stringify(errorDetail)}`);
      }

      debugLog('success', 'Respuesta exitosa, creando blob...');
      
      // Crear blob con verificaciones adicionales
      const blob = await response.blob();
      
      debugLog('data', 'Blob creado', {
        size: blob.size,
        type: blob.type,
        isEmpty: blob.size === 0
      });
      
      // Verificaciones del blob
      if (blob.size === 0) {
        throw new Error('El archivo generado está vacío (0 bytes)');
      }
      
      if (blob.size < 100) {
        debugLog('warning', 'Archivo muy pequeño, podría contener solo un error');
        // Intentar leer el contenido como texto para debug
        try {
          const text = await blob.text();
          debugLog('warning', 'Contenido del blob pequeño', { content: text });
        } catch (e) {
          debugLog('warning', 'No se pudo leer el contenido del blob', e);
        }
      }
      
      if (!blob.type.includes('spreadsheet') && !blob.type.includes('excel')) {
        debugLog('warning', 'Tipo MIME inesperado para Excel', { type: blob.type });
      }
      
      // Crear URL de descarga
      debugLog('info', 'Creando URL de descarga...');
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Crear elemento de descarga
      const fileName = `estructura_empresa_${empresaId}_${new Date().toISOString().slice(0,10)}.xlsx`;
      debugLog('info', 'Configurando descarga', { fileName });
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.style.display = 'none';
      
      // Agregar al DOM temporalmente
      document.body.appendChild(link);
      
      // Ejecutar descarga
      debugLog('info', 'Ejecutando descarga...');
      link.click();
      
      // Limpiar
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        debugLog('success', 'Limpieza completada');
      }, 100);
      
      debugLog('success', 'COMPLETADO - Descarga iniciada exitosamente');
      
      // Mostrar notificación de éxito
      if (typeof window !== 'undefined' && window.alert) {
        alert(`✅ Descarga iniciada: ${fileName}`);
      }
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        throw new Error('Timeout: La petición tardó más de 30 segundos');
      }
      
      throw fetchError;
    }
    
  } catch (error) {
    debugLog('error', 'ERROR FATAL en generación de Excel', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      empresaId
    });
    
    // Mostrar error detallado al usuario
    const userMessage = `❌ Error al generar Excel:
    
🔸 Empresa ID: ${empresaId}
🔸 Error: ${error.message}
🔸 Timestamp: ${new Date().toLocaleString()}

📋 Revisa la consola del navegador para más detalles.
    
💡 Posibles soluciones:
- Verifica que el servidor esté funcionando
- Asegúrate de que la empresa tenga datos
- Revisa la conexión a internet`;
    
    if (typeof window !== 'undefined' && window.alert) {
      alert(userMessage);
    }
    
    // Re-lanzar para que el caller pueda manejarlo
    throw error;
  }
}