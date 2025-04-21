import './DownloadPage.css';
import { BackButton, NextButton, DownloadButton, TitleSection, Description } from '../../components/index';

export function DownloadPage() {
    return (
        <section className='download-page-section'>
            <div className='description-content'>
                <TitleSection title="Descarga el documento para continuar con el proceso." />
                <Description variant="p" text="El archivo en formato Excel ya incluye los datos que ingresaste previamente. Solo necesitas completarlo con la información adicional que se solicita dentro del mismo archivo. Esta información es necesaria para realizar un análisis más preciso del ambiente de innovación en tu organización." />
                <DownloadButton text='Descargar'/>
            </div>
            <div className='video-content'>
                <Description text="Mira cómo hacerlo paso a paso." variant="forms"/>
                <iframe 
                    width="100%" 
                    height="424" 
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                    title="Video Frame" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                </iframe>
            </div>

            <section className='navigation-buttons'>
                <BackButton to="/datos_prueba" />
                <NextButton text='Siguiente' to="/upload_page" className="next-button" />
            </section>
        </section>
    )
}