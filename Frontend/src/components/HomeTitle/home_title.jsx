import './home_title.css';

export function HomeTitle({ title}) {
    return (
        <section className="title-home">
            <h1 className="tittle">{title}</h1>
        </section>
    );
}