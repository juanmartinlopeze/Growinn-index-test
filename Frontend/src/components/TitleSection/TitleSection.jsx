import './TitleSection.css';

export function TitleSection({ title}) {
    return (
        <section className="title-section">
            <h1 className="title">{title}</h1>
        </section>
    );
}