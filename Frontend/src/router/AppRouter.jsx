import { Route, Routes } from 'react-router-dom'
import { AreasForm, DatosPrueba, DownloadPage, HomeInnlab, InnlabForm, UploadPage, ValidationPage } from '../screen/index'

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
			</Routes>
		</>
	)
}

export default AppRouter
