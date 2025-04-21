import {Routes, Route} from 'react-router-dom';
import { InnlabForm,DatosPrueba,DownloadPage,UploadPage } from '../screen/index';

const AppRouter = () => {
  return (
    <>   
      <Routes>
        <Route path="/" element={<InnlabForm />} />
        <Route path="/datos_prueba" element={<DatosPrueba />} />
        <Route path="/download_page" element={<DownloadPage />} />
        <Route path="/upload_page" element={<UploadPage />} />
      </Routes>
      </>
  );
};

export default AppRouter;