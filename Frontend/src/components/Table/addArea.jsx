// Archivo: utils/addArea.js

export async function handleAddArea(tableData, setTableData, empresaId) {
    try {
      const nuevaArea = {
        name: `Área ${tableData.length + 1}`,
        roles: ['J1', 'J2', 'J3', 'J4'].map((j) => ({
          hierarchy: j,
          position: null,
          employees: null,
          subcargos: []
        }))
      }
  
      const nuevosNombres = [...tableData.map(a => a.name), nuevaArea.name]
  
      // Actualizar frontend
      setTableData(prev => [...prev, nuevaArea])
  
      // Actualizar backend
      await fetch(`http://localhost:3000/empresas/${empresaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ areas_nombres: nuevosNombres })
      })
  
      alert('✅ Nueva área añadida')
    } catch (err) {
      console.error('❌ Error al añadir área:', err)
      alert('❌ Error al añadir área')
    }
  }