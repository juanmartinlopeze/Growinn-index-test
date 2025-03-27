import "./next-button.css";
import nextIcon from "../../../public/next-icon.png";
import { useNavigate } from "react-router-dom";

export function NextButton({ text, to, onClick, className }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick(); // Ejecuta la función onClick si está definida
    navigate(to); // Navega a la ruta especificada
  };

  return (
    <section className={`button-section ${className}`}>
      <button className="custom-button" onClick={handleClick}>
        <div className="button-content">
          <span className="button-text">{text}</span>
          <span className="button-icon">
            <img src={nextIcon} alt="Next Icon" />
          </span>
        </div>
      </button>
    </section>
  );
}