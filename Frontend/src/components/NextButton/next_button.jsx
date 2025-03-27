export function NextButton({ text, icon, onClick, className }) {
    return (
      <button className={`custom-button ${className}`} onClick={onClick}>
        {icon && <span className="button-icon">{icon}</span>}
        {text}
      </button>
    );
}