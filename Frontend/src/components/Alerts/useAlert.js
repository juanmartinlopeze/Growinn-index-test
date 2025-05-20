import { useState } from 'react'

export const useAlert = () => {
    const [alertInfo, setAlertInfo] = useState(null)

    const showAlert = (type, title, message) => {
        return new Promise((resolve) => {
            setAlertInfo({
                type,
                title,
                message,
                onConfirm: () => {
                    setAlertInfo(null)
                    resolve(true)
                },
                onCancel: () => {
                    setAlertInfo(null)
                    resolve(false)
                }
            })
        })
    }

    return { alertInfo, showAlert }
}