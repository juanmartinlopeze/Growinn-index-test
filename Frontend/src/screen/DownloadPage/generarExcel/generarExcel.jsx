const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export async function generarExcelDesdeBD(empresaId) {
  try {
    const response = await fetch(`${BASE_URL}/excel/${empresaId}`);
    if (!response.ok) throw new Error('No se pudo generar el archivo');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `estructura_empresa_${empresaId}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("❌ Error al descargar el Excel:", err);
    alert("❌ No se pudo descargar el archivo Excel");
  }
}
