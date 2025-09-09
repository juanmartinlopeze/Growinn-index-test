import "./TextQuestions.css";

export function Questions({ text, variant }) {
  return <p className={`questions ${variant}`}>{text}</p>;
}
