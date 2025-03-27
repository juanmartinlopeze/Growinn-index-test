import "./next-button.css";
import nextIcon from "../../../public/next-icon.png";

export function NextButton({ text, onClick, className }) {
  return (
    <section className={`button-section ${className}`}>
      <button className="custom-button" onClick={onClick}>
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