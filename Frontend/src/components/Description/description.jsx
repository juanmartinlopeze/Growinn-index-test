import './description.css';

export function Description({ text, variant }) {
  return <p className={`description ${variant}`}>{text}</p>;
}