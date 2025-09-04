import "./DownloadPage.css";
import { StepBreadcrumb } from "../../components/StepBreadcrumb/breadcrumb";
import { TitleSection, Description, Button } from "../../components/index";
import { generarExcelDesdeBD } from "./generarExcel/generarExcel";
import { useEmpresaData } from "../../components/Table/useEmpresaData";
import { useNavigate } from "react-router-dom";

export function DownloadPage() {
  const { empresaId } = useEmpresaData();
  const navigate = useNavigate();

  const handleDownload = () => {
    if (!empresaId)
      return alert("❌ No se ha cargado la empresa correctamente.");
    generarExcelDesdeBD(empresaId);
  };

  return (
    <div>
      <StepBreadcrumb
        steps={["1", "2", "3", "4"]}
        currentStep={3} // Paso 4
        clickableSteps={[2]} // Permite volver al paso 3
        onStepClick={(idx) => {
          if (idx === 2) navigate("/datos_prueba"); // Ajusta la ruta si tu pantalla de tabla tiene otro nombre
        }}
      />

      <section className="download-page-section">
        <div className="description-content">
          <TitleSection title="Descarga el documento para continuar con el proceso." />
          <Description
            variant="p"
            text="El archivo en formato Excel ya incluye los datos que ingresaste previamente. Solo necesitas completarlo con la información adicional que se solicita dentro del mismo archivo. Esta información es necesaria para realizar un análisis más preciso del ambiente de innovación en tu organización."
          />
          <Button
            variant="download"
            className="download"
            text="Descargar"
            onClick={handleDownload}
          />
        </div>

        <div className="video-content">
          <Description text="Mira cómo hacerlo paso a paso." variant="forms" />
          <iframe
            width="100%"
            height="424"
            src="https://www.youtube.com/embed/yKxF9swBwUk?vq=hd1080"
            title="Video Frame"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <section className="navigation-buttons">
          <Button variant="back" to="/datos_prueba" />
          <Button variant="next" text="Siguiente" to="/upload_page" />
        </section>
      </section>
    </div>
  );
}
