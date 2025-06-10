import { Button } from "../../components/index";
import './ExplanationScreen.css';

export function ExplanationScreen({ onStart }) {
    return (
        <div className="survey-container">
            <div className="survey-content">
                <h2 className="survey-header">Estimado(a) colaborador(a)</h2>
                <p className="survey-text">Nos encontramos en una era donde la innovación es esencial para el crecimiento y éxito sostenido de cualquier organización. La capacidad de adaptarse, evolucionar y crear soluciones novedosas es lo que nos diferencia y nos permite mantenernos a la vanguardia en un mercado en constante cambio.</p>
                <p className="survey-text">Por ello, te presentamos la encuesta <strong>InnLab INNDEX</strong>, una herramienta diseñada para medir la innovación dentro de nuestra organización. Tu participación es crucial, ya que nos ayudará a entender cómo vivimos y percibimos la innovación en nuestro día a día.</p>

                <h3><strong>Antes de comenzar, queremos compartir contigo algunos puntos claves:</strong></h3>
                <ul className="survey-list">
                    <li className="survey-list-list"><strong>Duración:</strong> La encuesta tomará aproximadamente 15 minutos de tu tiempo.</li>
                    <li className="survey-list-list"><strong>Honestidad:</strong> Te pedimos que respondas de acuerdo a cómo es la situación actual, no cómo quisieras que fuera. Tu sinceridad es esencial para obtener resultados precisos.</li>
                    <li className="survey-list-list" ><strong>Confidencialidad:</strong> Queremos asegurarte que tus respuestas serán totalmente anónimas. La información recopilada será utilizada exclusivamente por nosotros para fines de análisis y mejora.</li>
                    <li className="survey-list-list"><strong>Transparencia:</strong> Una vez analizados, compartiremos los resultados generales con la empresa, pero nunca se divulgarán respuestas individuales.</li>
                </ul>
                <p>Te agradecemos de antemano por tu tiempo y colaboración. Juntos, construiremos un futuro más innovador para tu organización.</p>
                <div className="survey-buttons">
                <Button variant="next" text="Comenzar Encuesta" onClick={onStart} />
                </div>
            </div>
        </div>
    );
}
