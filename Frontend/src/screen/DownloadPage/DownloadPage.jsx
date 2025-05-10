import './DownloadPage.css';
import { TitleSection, Description } from '../../components/index';
import { generarExcelDesdeBD } from '../../components/Table/exportExcel'; // <-- Asegúrate que sea la ruta correcta
import { useEmpresaData } from '../../components/Table/useEmpresaData';

export function DownloadPage() {
  const { tableData } = useEmpresaData();

  const handleDownload = () => {
    generarExcelDesdeBD({
      areas: tableData.areas || [],
      cargos: tableData.cargos || [],
      subcargos: tableData.subcargos || [],
      usuarios: tableData.usuarios || []
    });
  };

  return (
    <section className='download-page-section'>
      <div className='description-content'>
        <TitleSection title="Descarga el documento para continuar con el proceso." />
        <Description
          variant="p"
          text="El archivo en formato Excel ya incluye los datos que ingresaste previamente. Solo necesitas completarlo con la información adicional que se solicita dentro del mismo archivo. Esta información es necesaria para realizar un análisis más preciso del ambiente de innovación en tu organización."
        />
        <Button variant='download' className='download' text='Descargar' onClick={handleDownload} />
      </div>

      <div className='video-content'>
        <Description text="Mira cómo hacerlo paso a paso." variant="forms" />
        <iframe
          width="100%"
          height="424"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Video Frame"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <section className='navigation-buttons'>
        <Button variant='back' to="/datos_prueba" />
        <Button variant='next' text='Siguiente' to="/upload_page" />
      </section>
    </section>
  )
}
