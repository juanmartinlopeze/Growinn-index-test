import './UploadPage.css';
import { BackButton, NextButton, DownloadButton, TitleSection, Description } from '../../components/index';

export function UploadPage() {
    return (
        <section className='upload-page-section'>
            <div className='description-content'>
                <TitleSection title="Cargar archivo." />
                <Description variant="p" text="Por favor, proporcione el archivo Excel con toda la información correctamente documentada. Esta información será validada automáticamente para asegurar que esté completa y en el formato adecuado." />
                <Description variant="p" text="Este paso es esencial para obtener un análisis preciso y representativo del ambiente de innovación en su organización." />
            </div>
            <div class="upload-container">
                <input type="file" id="file-upload" class="file-input" />
                <label for="file-upload" class="upload-label">
                    {/* <img src="upload-icon.svg" alt="Upload Icon" class="upload-icon" /> */}
                    <p>Click to upload or drag and drop</p>
                    <span>Maximum file size 50 MB</span>
                </label>
            </div>

            <section className='navigation-buttons'>
                <BackButton to="/download_page" />
                <NextButton text='Siguiente' to="/upload_page" className="next-button" />
            </section>
        </section>
    )
}