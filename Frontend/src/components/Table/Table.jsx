import React, { useState } from 'react'
import areasData from '../../data/data'
import './Table.css'

export function Table() {
    const [modal, setModal] = useState(false)
    const [nameModal, setNameModal] = useState(false)
    const [tableData, setTableData] = useState(areasData)
    const [selectedHierarchy, setSelectedHierarchy] = useState(null)
    const [selectedArea, setSelectedArea] = useState(null)
    const [position, setPosition] = useState('')
    const [employees, setEmployees] = useState('')
    const [newAreaName, setNewAreaName] = useState('')

    const svg = (
        <svg width='24' height='25' viewBox='0 0 24 25' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
                d='M12 22.0646C17.5 22.0646 22 17.5646 22 12.0646C22 6.56458 17.5 2.06458 12 2.06458C6.5 2.06458 2 6.56458 2 12.0646C2 17.5646 6.5 22.0646 12 22.0646Z'
                stroke='#292D32'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path d='M12 8.06458V13.0646' stroke='#292D32' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M11.9945 16.0646H12.0035' stroke='#292D32' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
    )

    const svg_edit = (
        <svg height="25" viewBox="0 -1 401.52289 401" width="24" xmlns="http://www.w3.org/2000/svg" id="fi_1159633"><path d="m370.589844 250.972656c-5.523438 0-10 4.476563-10 10v88.789063c-.019532 16.5625-13.4375 29.984375-30 30h-280.589844c-16.5625-.015625-29.980469-13.4375-30-30v-260.589844c.019531-16.558594 13.4375-29.980469 30-30h88.789062c5.523438 0 10-4.476563 10-10 0-5.519531-4.476562-10-10-10h-88.789062c-27.601562.03125-49.96875 22.398437-50 50v260.59375c.03125 27.601563 22.398438 49.96875 50 50h280.589844c27.601562-.03125 49.96875-22.398437 50-50v-88.792969c0-5.523437-4.476563-10-10-10zm0 0"></path><path d="m376.628906 13.441406c-17.574218-17.574218-46.066406-17.574218-63.640625 0l-178.40625 178.40625c-1.222656 1.222656-2.105469 2.738282-2.566406 4.402344l-23.460937 84.699219c-.964844 3.472656.015624 7.191406 2.5625 9.742187 2.550781 2.546875 6.269531 3.527344 9.742187 2.566406l84.699219-23.464843c1.664062-.460938 3.179687-1.34375 4.402344-2.566407l178.402343-178.410156c17.546875-17.585937 17.546875-46.054687 0-63.640625zm-220.257812 184.90625 146.011718-146.015625 47.089844 47.089844-146.015625 146.015625zm-9.40625 18.875 37.621094 37.625-52.039063 14.417969zm227.257812-142.546875-10.605468 10.605469-47.09375-47.09375 10.609374-10.605469c9.761719-9.761719 25.589844-9.761719 35.351563 0l11.738281 11.734375c9.746094 9.773438 9.746094 25.589844 0 35.359375zm0 0"></path></svg>
    )

    function handleSave(e) {
        e.preventDefault()

        if (!position || !employees) {
            alert('Todos los campos son obligatorios')
            return
        }

        setTableData((prevData) =>
            prevData.map((area) => {
                if (area.name === selectedArea) {
                    return {
                        ...area,
                        roles: area.roles.map((role) => (role.hierarchy === selectedHierarchy ? { ...role, position, employees } : role)),
                    }
                }
                return area
            })
        )

        resetModalState()
    }

    function handleNameSave(e) {
        e.preventDefault()

        if (!newAreaName) {
            alert('Todos los campos son obligatorios')
            return
        }

        setTableData((prevData) =>
            prevData.map((area) => {
                if (area.name === selectedArea) {
                    return {
                        ...area,
                        name: newAreaName
                    }
                }
                return area
            })
        )

        resetNameModalState()
    }

    function toggleModal() {
        setModal(!modal)
    }

    function toggleNameModal() {
        setNameModal(!nameModal)
    }

    function resetModalState() {
        setPosition('')
        setEmployees('')
        setSelectedHierarchy(null)
        setSelectedArea(null)
        setModal(false)
    }

    function resetNameModalState() {
        setNewAreaName('')
        setSelectedArea(null)
        setNameModal(false)
    }

    // function resetToInitialState() {
    //     setTableData(areasData)
    //     resetModalState()
    //     resetNameModalState()
    // }

    function deleteRole() {
        setTableData((prevData) =>
            prevData.map((area) => {
                if (area.name === selectedArea) {
                    return {
                        ...area,
                        roles: area.roles.map((role) => (role.hierarchy === selectedHierarchy ? { ...role, position: null, employees: null } : role)),
                    }
                }
                return area
            })
        )
        resetModalState()
    }

    return (
        <>
            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th id='blank'></th>
                            <th className='jerarquia'>
                                <div>J1{svg}</div>
                            </th>
                            <th className='jerarquia'>
                                <div>J2{svg}</div>
                            </th>
                            <th className='jerarquia'>
                                <div>J3{svg}</div>
                            </th>
                            <th className='jerarquia'>
                                <div>J4{svg}</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((area, index) => (
                            <tr key={index}>
                                <th className='area-row' scope='row'>
                                    <div
                                        className='area-name'
                                        onClick={() => {
                                            setSelectedArea(area.name)
                                            toggleNameModal()
                                        }}
                                    >
                                        {area.name}
                                        {svg_edit}
                                    </div>
                                </th>
                                {area.roles.map((role, roleIndex) => {
                                    // const isRowFilled = area.roles.some((r) => r.position !== null)

                                    return (
                                        <td key={roleIndex}>
                                            {role.position ? (
                                                <span
                                                    onClick={() => {
                                                        setSelectedArea(area.name)
                                                        setSelectedHierarchy(role.hierarchy)
                                                        setPosition(role.position)
                                                        setEmployees(role.employees)
                                                        toggleModal()
                                                    }}
                                                >
                                                    <p className='role-name'>{role.position}</p> | <p>{role.employees}</p>
                                                </span>
                                            ) : (
                                                <button
                                                    // disabled={isRowFilled}
                                                    // className={isRowFilled ? 'btn-disabled' : ''}
                                                    onClick={() => {
                                                        setSelectedArea(area.name)
                                                        setSelectedHierarchy(role.hierarchy)
                                                        toggleModal()
                                                    }}
                                                >
                                                    +
                                                </button>
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {modal && (
                <div className='modal-container'>
                    <div className='overlay'>
                        <div className='modal-content'>
                            <form onSubmit={handleSave}>
                                <label htmlFor='position'>Cargo</label>
                                <input type='text' id='position' value={position} onChange={(e) => setPosition(e.target.value)} />
                                <label htmlFor='employees'>Empleados</label>
                                <input type='number' id='employees' value={employees} onChange={(e) => setEmployees(e.target.value >= 0 ? e.target.value : '')} />
                                <div className='modal-buttons'>
                                    <button type='button' onClick={deleteRole}>Eliminar</button>
                                    <button type='submit'>Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {nameModal && (
                <div className='modal-container'>
                    <div className='overlay'>
                        <div className='modal-content'>
                            <form onSubmit={handleNameSave}>
                                <label htmlFor='newAreaName'>Nombre del área</label>
                                <input type='text' id='newAreaName' value={newAreaName} onChange={(e) => setNewAreaName(e.target.value)} />
                                <div className='modal-buttons'>
                                    <button type='button' onClick={resetNameModalState}>Cancelar</button>
                                    <button type='submit'>Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}