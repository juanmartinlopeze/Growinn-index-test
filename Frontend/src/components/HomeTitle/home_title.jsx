import './home_title.css';

export function HomeTitle({ title}) {
    return (
        <section className="title-home">
            <h1 className="title">{title}</h1>
        </section>
    );
}
