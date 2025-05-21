import './TitleSection.css';

export function TitleSection({ title}) {
    return (
        <section className="title-section">
            <h1 className="title-main">{title}</h1>
        </section>
    );
}
