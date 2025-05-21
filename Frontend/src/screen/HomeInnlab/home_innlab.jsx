import "./home_innlab.css"
import {
  Subtitle,
  Description,
  Button,
  HomeTitle,
  TitleJerarquias,
  List
} from "../../components/index";

const jerarquiasIntro = "En la mayoría de las organizaciones, existen cuatro niveles jerárquicos:";
const jerarquiasItems = [
  "El Nivel 1 (Ejecución) realiza tareas operativas esenciales.",
  "El Nivel 2 (Supervisión) garantiza su cumplimiento.",
  "El Nivel 3 (Gerencial) implementa estrategias y toma decisiones a mediano plazo.",
  "El Nivel 4 (Directivo) define la estrategia general, establece objetivos y asigna recursos."
];

export function HomeInnlab() {
  return (
    <section className="container-home">
      <HomeTitle title="Información previa..." />
      <TitleJerarquias title="Jerarquías y áreas" />

      <div>
        <div>
          <Subtitle text="Jerarquías" />
          <Description text={jerarquiasIntro} />
          <List items={jerarquiasItems} />
        </div>
        <div>
          <Subtitle text="Áreas" />
          <Description text="Las áreas de las empresas son los departamentos o funciones específicas, como Recursos Humanos o Finanzas. Evaluar la innovación en cada área permite identificar el alineamiento y los desafíos dentro de la cultura de innovación." />
        </div>
      </div>

      <Button variant="back" to="/" />
      <Button variant="next" text="Siguiente" to="/innlab_form" />
    </section>
  );
}