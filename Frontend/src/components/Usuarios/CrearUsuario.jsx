import { useState } from "react";

export default function CrearUsuario() {
  const [name, setName] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch("https://tu-api-en-render.com/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      setMensaje("✅ Usuario creado exitosamente");
      setName("");
    } else {
      setMensaje("❌ Error al crear usuario");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Crear Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del usuario"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Crear Usuario
        </button>
      </form>
      {mensaje && <p className="mt-2 text-center">{mensaje}</p>}
    </div>
  );
}
