import {Routes, Route} from 'react-router-dom';
import { InnlabForm } from '../screen/index';

const AppRouter = () => {
  return (
    <>   
      <Routes>
        <Route path="/" element={<InnlabForm />} />
      </Routes>
      </>
  );
};

export default AppRouter;