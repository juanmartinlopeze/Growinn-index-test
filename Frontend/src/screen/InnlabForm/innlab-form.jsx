import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Description, Form, Subtitle, TitleSection, Tooltip } from '../../components/index'
import './innlab-form.css'

export function InnlabForm() {
  const storageKey = 'innlabFormData'
  const navigate = useNavigate()

  // 1. Cargar datos iniciales desde localStorage (si existen)
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved
        ? JSON.parse(saved)
        : { empleados: '', jerarquia1: '', jerarquia2: '', jerarquia3: '', jerarquia4: '', areas: '' }
    } catch (e) {
      console.error('Error parsing innlabFormData:', e)
      return { empleados: '', jerarquia1: '', jerarquia2: '', jerarquia3: '', jerarquia4: '', areas: '' }
    }
  })

  // estados para mostrar el tipo de alerta
  const [showAlert, setShowAlert] = useState(false)
  const [alertType, setAlertType] = useState('complete')
  const [alertMessage, setAlertMessage] = useState('')

  // 2. Cada vez que formData cambie, lo guardamos en localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(formData))
  }, [formData])

  const questions = [
    {
      id: 1,
      title: '¿Cuántos empleados tiene tu empresa?',
      placeholder: 'Digite aquí',
      icon: null,
      field: 'empleados',
    },
    {
      id: 2,
      title: '¿Cuántos empleados hay en la jerarquía 1?',
      placeholder: 'Digite aquí',
      icon: (
        <Tooltip
          triggerText={<img src='/info-circle.png' alt='Jerarquía 1' />}
          popupText='La Jerarquía 1 (Ejecución): realiza tareas operativas esenciales.'
        />
      ),
      field: 'jerarquia1',
    },
    {
      id: 3,
      title: '¿Cuántos empleados hay en la jerarquía 2?',
      placeholder: 'Digite aquí',
      icon: (
        <Tooltip
          triggerText={<img src='/info-circle.png' alt='Jerarquía 2' />}
          popupText='La Jerarquía 2 (Supervisión): asegura que las tareas se cumplan según procedimientos y estándares.'
        />
      ),
      field: 'jerarquia2',
    },
    {
      id: 4,
      title: '¿Cuántos empleados hay en la jerarquía 3?',
      placeholder: 'Digite aquí',
      icon: (
        <Tooltip
          triggerText={<img src='/info-circle.png' alt='Jerarquía 3' />}
          popupText='La Jerarquía 3 (Gerencial): implementa estrategias y toma decisiones a mediano plazo.'
        />
      ),
      field: 'jerarquia3',
    },
    {
      id: 5,
      title: '¿Cuántos empleados hay en la jerarquía 4?',
      placeholder: 'Digite aquí',
      icon: (
        <Tooltip
          triggerText={<img src='/info-circle.png' alt='Jerarquía 4' />}
          popupText='La Jerarquía 4 (Directivo): define la estrategia general, establece objetivos y asigna recursos.'
        />
      ),
      field: 'jerarquia4',
    },
    {
      id: 6,
      title: '¿Cuántas áreas tiene tu empresa?',
      placeholder: 'Digite aquí',
      icon: null,
      field: 'areas',
    },
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    const isFormComplete = Object.values(formData).every(val => val.trim() !== '')

    if (!isFormComplete) {
      setAlertType('complete')
      setAlertMessage('Por favor, completa todos los campos antes de continuar.')
      setShowAlert(true)
      return
    }

    const totalEmpleados = Number(formData.empleados)
    const sumaJerarquias =
      Number(formData.jerarquia1) +
      Number(formData.jerarquia2) +
      Number(formData.jerarquia3) +
      Number(formData.jerarquia4)

    if (sumaJerarquias !== totalEmpleados) {
      setAlertType('error')
      setAlertMessage(
        `La suma de las jerarquías (${sumaJerarquias}) no coincide con el total de empleados (${totalEmpleados}).`
      )
      setShowAlert(true)
      return
    }

    const totalAreas = Number(formData.areas)

    // 3. Limpiar storage y navegar
    navigate('/areas_form', {
      state: {
        totalAreas,
        empleados: formData.empleados,
        jerarquia1: formData.jerarquia1,
        jerarquia2: formData.jerarquia2,
        jerarquia3: formData.jerarquia3,
        jerarquia4: formData.jerarquia4,
      },
    })
  }

  return (
    <section className='container'>
      <div className='innlab-form-header'>
        <TitleSection title='Jerarquías y cargos' />
        <Subtitle text='¿Por qué pedimos esta información?' />
        <Description
          text='Los datos que solicitamos sobre jerarquías y áreas de la empresa nos permiten comprender cómo se distribuyen las funciones y la toma de decisiones. Esta información es clave para evaluar el nivel de innovación y detectar oportunidades de mejora dentro de la organización.'
          variant='forms'
        />
      </div>

      <div className='forms-container'>
        <Description
          text='Por favor, ingrese únicamente números sin puntos, comas u otros caracteres especiales.'
          variant='forms2'
        />
        <Form questions={questions} onInputChange={handleInputChange} formData={formData} />
      </div>

      <div className='buttons-container'>
        <Button variant='back' onClick={() => navigate(-1)} />
        <Button variant='next' text='Siguiente' onClick={handleSubmit} />
      </div>

      <img className='linea-curva' src='/BgLine-decoration.png' alt='Imagen decorativa' />
      <img className='puntos' src='/BgPoints-decoration.png' alt='imagen decorativa' />

      {showAlert && (
        <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
    </section>
  )
}
