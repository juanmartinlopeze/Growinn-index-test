import { Route, Routes } from 'react-router-dom'
import AuthCallback from '../screen/AuthCallback'
import { AreasForm, DatosPrueba, DownloadPage, HomeInnlab, InnlabForm, Register, UploadPage, ValidationPage, EmailManagement } from '../screen/index'
import LandingPage from '../screen/LandingPage/LandingPage'
import Demo from '../screen/Demo/Demo'
import Login from '../screen/Login/Login'
import SurveyScreen from '../screen/SurveyScreen/SurveyScreen'
const AppRouter = () => {
	return (
		<>
			<Routes>
				<Route path='/' element={<LandingPage />} />
				<Route path='/home' element={<HomeInnlab />} />
            <Route path='/demo' element={<Demo />} />
				<Route path='/innlab_form' element={<InnlabForm />} />
				<Route path='/areas_form' element={<AreasForm />} />
				<Route path='/datos_prueba' element={<DatosPrueba />} />
				<Route path='/download_page' element={<DownloadPage />} />
				<Route path='/upload_page' element={<UploadPage />} />
				<Route path='/email_management' element={<EmailManagement />} />
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
