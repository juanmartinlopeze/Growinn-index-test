import {Routes, Route} from 'react-router-dom';
import { InnlabForm,DatosPrueba,DownloadPage,UploadPage,AreasForm,HomeInnlab} from '../screen/index';


const AppRouter = () => {
  return (
    <>   
      <Routes>
        <Route path="/" element={<HomeInnlab />} />
        <Route path="/innlab_form" element={<InnlabForm />} />
        <Route path="/areas_form" element={<AreasForm />} />
        <Route path="/datos_prueba" element={<DatosPrueba />} />
        <Route path="/download_page" element={<DownloadPage />} />
        <Route path="/upload_page" element={<UploadPage />} />
      </Routes>
      </>
  );
};

export default AppRouter;