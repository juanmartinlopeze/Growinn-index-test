import { Route, Routes } from 'react-router-dom'
import { AreasForm, DatosPrueba, DownloadPage, HomeInnlab, InnlabForm, Register, UploadPage, ValidationPage } from '../screen/index'
import Login from '../screen/Login/Login'
import AuthCallback from '../screen/AuthCallback'
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
				<Route path='/encuesta' element={<SurveyScreen />} />
				<Route path='/register' element={<Register />} />
				<Route path='/login' element={<Login />} />
				<Route path='/auth/callback' element={<AuthCallback />} />
			</Routes>
		</>
	)
}

export default AppRouter
