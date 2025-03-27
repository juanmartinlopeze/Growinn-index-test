import {Form} from "../../components/Form/Form"
import {NextButton} from "../../components/NextButton/next_button"
import { BackButton } from "../../components";
import "./innlab-form.css"

export function InnlabForm () {
    const questions = [
        { id: 1, title: "¿Cuántos empleados tiene tu empresa?", placeholder: "Digite aquí", icon: null },
        { id: 2, title: "¿Cuántos son los cargos de cada jerarquía 1?", placeholder: "Digite aquí", icon: <img src="/info-circle.png" alt="Jerarquía" /> },
        { id: 3, title: "¿Cuántos son los cargos de cada jerarquía 2?", placeholder: "Digite aquí", icon: <img src="/info-circle.png" alt="Jerarquía" />},
        { id: 4, title: "¿Cuántos son los cargos de cada jerarquía 3?", placeholder: "Digite aquí", icon: <img src="/info-circle.png" alt="Jerarquía" /> },
        { id: 5, title: "¿Cuántos son los cargos de cada jerarquía 4?", placeholder: "Digite aquí", icon: <img src="/info-circle.png" alt="Jerarquía" /> },
        { id: 6, title: "¿Cuántas áreas tiene tu empresa?", placeholder: "Digite aquí", icon: null },
      ];
      return (
        <section className="forms-container">
          <div>
            <Form questions={questions} />
            <div className="buttons-container">
          <BackButton />
          <NextButton text="Siguiente" onClick={() => alert("Formulario enviado")} />
        </div>
          </div>
        </section>
      );
  
  
  }