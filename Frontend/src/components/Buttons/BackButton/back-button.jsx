import "./back-button.css";
import arrowLeft from "../../../../public/arrow-left.png";
import { useNavigate } from "react-router-dom";

export function BackButton({ to, onClick, className }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
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