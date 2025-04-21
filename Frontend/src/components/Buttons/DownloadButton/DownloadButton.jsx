import './DownloadButton.css';

export function DownloadButton({ text, onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick(); // Ejecuta la función que le pases
    }
  };

  return (
    <button className="download-button" onClick={handleClick}>
      <img 
        src="/arrow-left.png"  // Usar ruta desde public
        alt="Descargar"
        style={{ transform: 'rotate(-90deg)' }}
      />
      {text}
    </button>
  );
}
