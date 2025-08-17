import { Route, Routes } from 'react-router-dom'
import { AreasForm, DatosPrueba, DownloadPage, HomeInnlab, InnlabForm, UploadPage, ValidationPage, Register } from '../screen/index'
import SurveyScreen from '../screen/SurveyScreen/SurveyScreen'
const AppRouter = () => {
	return (
		<>
			<Routes>
				<Route path='/' element={<HomeInnlab />} />
				<Route path='/innlab_form' element={<InnlabForm />} />
				<Route path='/areas_form' element={<AreasForm />} />
				<Route path='/datos_prueba' element={<DatosPrueba />} />
				<Route path='/download_page' element={<DownloadPage />} />
				<Route path='/upload_page' element={<UploadPage />} />
				<Route path='/validation_page' element={<ValidationPage />} />
				<Route path="/encuesta" element={<SurveyScreen />} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</>
	)
}

export default AppRouter
