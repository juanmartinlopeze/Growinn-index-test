import {Routes, Route} from 'react-router-dom';
import { InnlabForm,DatosPrueba } from '../screen/index';

const AppRouter = () => {
  return (
    <>   
      <Routes>
        <Route path="/" element={<InnlabForm />} />
        <Route path="/datos_prueba" element={<DatosPrueba />} />
      </Routes>
      </>
  );
};

export default AppRouter;