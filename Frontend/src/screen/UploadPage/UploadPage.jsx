import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Description, FileUploadPreview, TitleSection } from '../../components/index'
import { useEmpresaData } from '../../components/Table/useEmpresaData'
import './UploadPage.css'

export function UploadPage() {
	const { empresaId } = useEmpresaData()
	const [file, setFile] = useState(null)
	const [generalError, setGeneralError] = useState('')
	const [excelWarnings, setExcelWarnings] = useState([])
	const [successMsg, setSuccessMsg] = useState('')
	const navigate = useNavigate()

	const handleFileChange = (e) => {
		setGeneralError('')
		setExcelWarnings([])
		setSuccessMsg('')
		const chosen = e.target.files ? e.target.files[0] : e
		setFile(chosen)
	}

	const handleSubmit = async () => {
		setGeneralError('')
		setExcelWarnings([])
		setSuccessMsg('')
		if (!file) {
			setGeneralError('Por favor selecciona un archivo .xlsx')
			return
		}
		if (!empresaId) {
			setGeneralError('❌ No se ha identificado la empresa.')
			return
		}
		const formData = new FormData()
		formData.append('file', file)
		formData.append('empresaId', empresaId)
		try {
			const res = await fetch('http://localhost:3000/upload-excel', {
				method: 'POST',
				body: formData,
			})
			const body = await res.json().catch(() => ({}))
			if (!res.ok && Array.isArray(body.warnings)) {
				setExcelWarnings(body.warnings)
				navigate('/validation_page', {
					state: { excelWarnings: body.warnings, file },
				})
				return
			}

			if (!res.ok) {
				throw new Error(body.error || 'Error desconocido')
			}
			setSuccessMsg(`✔️ Procesadas ${body.inserted} filas correctamente.`)
			setFile(null)
		} catch (err) {
			setGeneralError(`❌ ${err.message}`)
		}
	}

	return (
		<>
			<section className='upload-page-section'>
				<div className='description-content'>
					<TitleSection title='Cargar archivo.' />
					<Description
						variant='p'
						text='Por favor, proporcione el archivo Excel con toda la información correctamente documentada. Esta información será validada automáticamente para asegurar que esté completa y en el formato adecuado.'
					/>
					<Description variant='p' text='Este paso es esencial para obtener un análisis preciso y representativo del ambiente de innovación en su organización.' />
				</div>
				<FileUploadPreview onFileChange={handleFileChange} file={file} accept='.xlsx' />
				{generalError && <p className='error-message'>{generalError}</p>}
				{successMsg && <p className='success-message'>{successMsg}</p>}
				<section className='navigation-buttons'>
					<Button variant='back' to='/download_page' />
					<Button variant='next' text='Procesar' onClick={handleSubmit} disabled={!file || !empresaId} />
				</section>
			</section>
			<img className='line-bckg-img' src='/BgLine-decoration2.png' alt='' />
			<img className='line-bckg-img2' src='/BgLine-decoration3.png' alt='' />
         <img className='squares-bckg-img' src='/squaresBckg.png' alt='' />
		</>
	)
}
