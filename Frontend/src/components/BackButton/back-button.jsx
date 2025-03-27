import "./back-button.css";
import arrowLeft from "../../../public/arrow-left.png";

export function BackButton({ onClick, className }) {
  return (
    <section className={`back-button-section ${className}`}>
      <button className="back-button" onClick={onClick}>
        <div className="back-button-content">
          <span className="back-button-icon">
            <img src={arrowLeft} alt="Back Icon" />
          </span>
        </div>
      </button>
    </section>
  );
}