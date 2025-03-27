import "./back-button.css";
import arrowLeft from "../../../public/arrow-left.png";
import { useNavigate } from "react-router-dom";

export function BackButton({ to, onClick, className }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick(); // Ejecuta la función onClick si está definida
    if (to) {
      navigate(to); // Navega a la ruta especificada en la prop `to`
    } else {
      navigate(-1); // Navega hacia atrás en el historial si no se especifica `to`
    }
  };

  return (
    <section className={`back-button-section ${className}`}>
      <button className="back-button" onClick={handleClick}>
        <div className="back-button-content">
          <span className="back-button-icon">
            <img src={arrowLeft} alt="Back Icon" />
          </span>
        </div>
      </button>
    </section>
  );
}