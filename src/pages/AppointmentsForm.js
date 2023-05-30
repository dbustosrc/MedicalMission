import React, { useState, useEffect } from 'react';
import '../css/RegisterPacient.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Modal from 'react-modal';
import AddressForm from './AddressForms';
import OccupationForm from './OccupationForms';
import { API_BASE_URL } from '../config';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";

const personsUrl = API_BASE_URL + 'persons';

const PersonListForm = () => {
    const { user } = useAuth();
  
    const [personData, setPersonData] = useState({
        idCardNumber: '',
        identification: '',
        firstname: '',
        secondname: '',
        paternallastname: '',
        maternalLastname: '',
        gender: '',
        ethnicGroup: '',
        occupation: '',
        birthdate: '',
        maritalStatus: '',
        phonenumber: '',
        address: '',
        educationalLevel: '',
        related: '',
        relationship: '',
    });
  
    const [appointmentData, setAppointmentData] = useState({
        period: '',
        medicalSpecialization: '',
        person: '',
        attentionDate: '',
        observation: ''
    });
  
    const [personList, setPersonList] = useState([]);
  
    useEffect(() => {
        // Realizar solicitud HTTP a la API para obtener los datos de las personas
        axios
            .get(personsUrl, {
                headers: {
                    Authorization: user
                }
            })
            .then((response) => {
                // Actualizar el estado con los datos recibidos de la API
                setPersonList(response.data.persons);
            })
            .catch((error) => {
                console.error('Error al obtener los datos de las personas:', error);
            });
    }, []);
  
  
    const handleChange = (e) => {
        setPersonData({
            ...personData,
            [e.target.name]: e.target.value,
        });
    };
  
    const handleSubmit = (e) => {
        e.preventDefault();
        setAppointmentData({
            period: '',
            medicalSpecialization: '',
            person: '',
            attentionDate: '',
            observation: '',
        });
        setPersonList([...personList, personData]);
        setPersonData({
            idCardNumber: '',
            identification: '',
            firstname: '',
            secondname: '',
            paternallastname: '',
            maternalLastname: '',
            gender: '',
            ethnicGroup: '',
            occupation: '',
            birthdate: '',
            maritalStatus: '',
            phonenumber: ''
        });
    };
  
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Período:</label>
                    <input
                        type="text"
                        name="period"
                        value={appointmentData.period}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Especialización médica:</label>
                    <input
                        type="text"
                        name="medicalSpecialization"
                        value={appointmentData.medicalSpecialization}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Persona:</label>
                    <input
                        type="text"
                        name="person"
                        value={appointmentData.person}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Fecha de atención:</label>
                    <input
                        type="text"
                        name="attentionDate"
                        value={appointmentData.attentionDate}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Observación:</label>
                    <input
                        type="text"
                        name="observation"
                        value={appointmentData.observation}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Guardar</button>
            </form>
  
            <table>
                <thead>
                    <tr>
                        <th>Número de carné</th>
                        <th>Primer nombre</th>
                        <th>Segundo nombre</th>
                        <th>Apellido paterno</th>
                        <th>Apellido materno</th>
                        <th>Género</th>
                        <th>Grupo étnico</th>
                        <th>Ocupación</th>
                        <th>Fecha de nacimiento</th>
                        <th>Estado civil</th>
                        <th>Número de teléfono</th>
                    </tr>
                </thead>
                <tbody>
                    {personList.map((person, index) => (
                        <tr key={index}>
                            <td>{person.idCardNumber}</td>
                            <td>{person.firstname}</td>
                            <td>{person.secondname}</td>
                            <td>{person.paternallastname}</td>
                            <td>{person.maternalLastname}</td>
                            <td>{person.gender}</td>
                            <td>{person.ethnicGroup}</td>
                            <td>{person.occupation}</td>
                            <td>{person.birthdate}</td>
                            <td>{person.maritalStatus}</td>
                            <td>{person.phonenumber}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
  };

  export default PersonListForm ;