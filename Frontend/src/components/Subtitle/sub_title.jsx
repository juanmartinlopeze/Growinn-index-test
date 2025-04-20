import "./sub_title.css";

export function Subtitle({ text, variant }) {
    return <h2 className={`subtitle ${variant}`}>{text}</h2>;
}