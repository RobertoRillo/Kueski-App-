import React, { useState, useEffect } from 'react';
import '../App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import logo from '../kueskilogo.png';
import axios from 'axios'
import styled from 'styled-components';
import Modal from './Modal';
import MostrarDatos from '../principal';
import SignIn from '../App'

function Requests() {
  const [requests, setRequests] = useState([]);
  const [redirectToClient, setRedirectToClient] = useState(false);
  const [estadoModal0,cambiarEstadoModal0]= useState(false);
  const [estadoModal1,cambiarEstadoModal1]= useState(false);
  const [estadoModal2,cambiarEstadoModal2]= useState(false);
  const [estadoModal3,cambiarEstadoModal3]= useState(false);
  const [estadoModal4,cambiarEstadoModal4]= useState(false);
  const [comment, setComment] = useState('');
  const [usuario, setUsuario] = useState({});
  const [formValues, setFormValues] = useState({
    name: usuario.name,
    first_last_name: usuario.first_last_name,
    born_date: usuario.born_date,
    nationality: usuario.nationality,
    state_of_birth: usuario.state_of_birth,
    economicActivity: usuario.economic_activity,
    curp: usuario.curp,
    phone_number: usuario.phone_number,
    email: usuario.email,
    country: usuario.country,
    state: usuario.state,
    city: usuario.city,
    neighborhood: usuario.neighborhood,
    zip_code: usuario.zipCode,
    street: usuario.street,
    ext_number: usuario.ext_number,
    int_number: usuario.int_number,
  });
  const [redirectToSignIn, setRedirectToSignIn] = useState(false);

  const handleSignInClick = () => {
    setRedirectToSignIn(true);
  };

  const handleClientClick = () => {
    setRedirectToClient(true);
  };

  useEffect(() => {
    // Hacer la solicitud GET a la API para obtener los datos de la tabla REQUESTS
    fetch('/requests')
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          // Obtener el mensaje de comment del primer resultado
          const firstRequest = data[0];
          setComment(firstRequest.comment);
        }
      })
      .catch(error => {
        console.error(error);
        // Manejar el error de la solicitud
      });
  }, []);
  
  useEffect(() => {
    axios.get('/requests')
      .then(response => {
        setRequests(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [estadoModal4]); // Agregar estadoModal4 como una dependencia para que la lista se actualice después de eliminar un usuario.

  const handleSubmit = (event) => {
    event.preventDefault();
    const changedData = {}; 
    const id = localStorage.getItem('id');
    const request_id = localStorage.getItem('request_id');
    Object.keys(formValues).forEach((key) => {
      if (formValues[key] !== usuario[key]) {
        changedData[key] = formValues[key];
      }
    });
    axios
      .put(`/users/${id}/${request_id}`, changedData)
      .then((response) => {
        console.log(response);
      });
  };

  


  const handleDeleteUser = () => {
    axios.delete(`/delete/${usuario.user_id}`)
      .then((response) => {
        console.log(response);
        cambiarEstadoModal4(false);
        // mostrar un mensaje de éxito
        // actualizar la lista de solicitudes pendientes
      })
      .catch((error) => {
        console.log(error);
        // mostrar un mensaje de error
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };
  
  if (redirectToSignIn) {
    return <SignIn />;
  }
 
  
  
  if (redirectToClient) {
    return <MostrarDatos />;
  }

  return (
    <div>
      <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container style={{ maxWidth: "80%" }}>
          <Navbar.Brand href="#home">
            <img
              src={logo}
              style={{ width: "70px", height: "70px", margin: "-20px" }}
              alt="Logo de la empresa"
            />
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Button variant="primary" onClick={handleSignInClick}>Logout</Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
        <ul>
          <li>
            <button onClick={handleClientClick}>Clients</button>
          </li>
          <li>
            <button>Requests</button>
          </li>
        </ul>
  
        <div id="mtable">
          <table id="table" className="table table-hover">
            <thead>
              <tr>
                <th>User Id</th>
                <th>Request id</th>
                <th>Comment</th>
                <th>Request date</th>
                <th>ARCO</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.request_id}>
                  <td>{request.user_id}</td>
                  <td>{request.request_id}</td>
                  <td>{request.comment}</td>
                  <td>{request.request_date}</td>
                  <td>
                    {request.arco_right === 1 && "Acceso"}
                    {request.arco_right === 2 && "Rectificación"}
                    {request.arco_right === 3 && "Cancelación"}
                    {request.arco_right === 4 && "Oposición"}
                  </td>
                  <td>
                    <div>
                      <ContenedorBotones>
                        <Boton onClick={() => {
                          cambiarEstadoModal0(!estadoModal0);
                          fetch(`/users/${request.user_id}`)
                            .then(response => response.json())
                            .then(data => setUsuario(data))
                            .then(localStorage.setItem('id', request.user_id))
                            .catch(error => console.error(error));
                          fetch(`/requests/${request.user_id}`)
                            .then(response => response.json())
                            .then(localStorage.setItem('request_id', request.request_id))
                            .then(data => {
                              const fetchedComment = data.comment || ''; // Maneja el caso en el que no se encuentre un comentario
                              setComment(fetchedComment);
                            })
                            .catch(error => console.error(error));
                        }}>
                            ...
                        </Boton>
                      </ContenedorBotones>
                      <Modal
                        estado={estadoModal0}
                        cambiarEstado={cambiarEstadoModal0}
                        mostarOverlay={true}
                      >
                        <Contenido>
                          <ContenedorBotones>
                            <Boton onClick={() => cambiarEstadoModal1(!estadoModal1)}>
                              Acceso
                            </Boton>
                          </ContenedorBotones>
  
                          <Modal
                            estado={estadoModal1}
                            cambiarEstado={cambiarEstadoModal1}
                            titulo="Acceso"
                          >
                            <Contenido>
                              <div className="tab-body">
                                <table className="modal-table">
                                  <tbody>
                                    <tr>
                                      <td className="categoria">Nombre:</td>
                                      <td className="normaltext">{usuario.name}</td>
                                    </tr>
                                    <tr>
                                      <td className="categoria">First Last Name:</td>
                                      <td className="normaltext">{usuario.first_last_name}</td>
                                    </tr>
                                    <tr>
                                      <td className="categoria">Born Date:</td>
                                      <td className="normaltext">{usuario.born_date}</td>
                                    </tr>
                                    <tr>
                                      <td className="categoria">Nationality:</td>
                                      <td className="normaltext">{usuario.nationality}</td>
                                    </tr>
                                    <tr>
                                      <td className="categoria">State of Birth:</td>
                                      <td className="normaltext">{usuario.state_of_birth}</td>
                                    </tr>
                                    <tr>
                                      <td className="categoria">Economic Activity:</td>
                                      <td className="normaltext">{usuario.economic_activity}</td>
                                    </tr>
                                    <tr>
                                      <td className="categoria">CURP:</td>
                                      <td className="normaltext">{usuario.curp}</td>
                                    </tr>
                                    <tr>
                                      <td className="categoria">Phone:</td>
                                      <td className="normaltext">{usuario.phone_number}</td>
                                    </tr>
                                    <tr>
                                      <td className="categoria">Email:</td>
                                      <td className="normaltext">{usuario.email}</td>
                                    </tr>
                                    <tr>
                                      <td className="categoria">Country:</td>
                                      <td className="normaltext">{usuario.country}</td>
                                    </tr>
                                    <tr>
                                      <td className="categoria">State:</td>
                                      <td className="normaltext">{usuario.state}</td>
                                    </tr>
                                    <tr>
                                      <td className="categoria">City:</td>
                                      <td className="normaltext">{usuario.city}</td>
                                    </tr>
                                    <tr>
                                      <td className="categoria">Neighborhood:</td>
                                      <td className="normaltext">{usuario.neighborhood}</td>
                                    </tr>
                                    <tr>
                                      <td className="categoria">Zip Code:</td>
                                      <td className="normaltext">{usuario.zip_code}</td>
                                    </tr>
                                    <tr>
                                      <td className="categoria">Street:</td>
                                      <td className="normaltext">{usuario.street}</td>
                                    </tr>
                                    <tr>
                                      <td className="categoria">Ext Number:</td>
                                      <td className="normaltext">{usuario.ext_number}</td>
                                    </tr>
                                    <tr>
                                      <td className="categoria">Int Number:</td>
                                      <td className="normaltext">{usuario.int_number}</td>
                                    </tr>
                                  </tbody>
                                </table>
                                <Boton type='submit'>Aceptar y enviar</Boton>
                              </div>
                            </Contenido>
                          </Modal>

                          <ContenedorBotones>
                            <Boton onClick={()=>cambiarEstadoModal2(!estadoModal2)}>Rectificacion</Boton>
                          </ContenedorBotones>

                          <Modal
                            estado={estadoModal2}
                            cambiarEstado={cambiarEstadoModal2}
                            titulo="Rectificacion"
                          >
                            <Contenido>
                              <form onSubmit={handleSubmit}>
                                <div className="tab-body">
                                  <table className="form-table">
                                    <tbody>
                                      <tr>
                                        <td>
                                          <label for="name">Nombre:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="name" name="name" defaultValue={usuario.name} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="first_last_name">First Last Name:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="first_last_name" name="first_last_name" defaultValue={usuario.first_last_name} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="born_date">Born Date:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="born_date" name="born_date" defaultValue={usuario.born_date} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="nationality">Nationality:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="nationality" name="nationality" defaultValue={usuario.nationality} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="state_of_birth">State of Birth:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="state_of_birth" name="state_of_birth" defaultValue={usuario.state_of_birth} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="economic_activity">Economic Activity:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="economic_activity" name="economic_activity" defaultValue={usuario.economic_activity} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="curp">CURP:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="curp" name="curp" defaultValue={usuario.curp} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="phone_number">Phone:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="phone_number" name="phone_number" defaultValue={usuario.phone_number} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="email">Email:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="email" name="email" defaultValue={usuario.email} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="country">Country:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="country" name="country" defaultValue={usuario.country} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="state">State:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="state" name="state" defaultValue={usuario.state} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="city">City:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="city" name="city" defaultValue={usuario.city} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="neighborhood">Neighborhood:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="neighborhood" name="neighborhood" defaultValue={usuario.neighborhood} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="zip_code">Zip code:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="zip_code" name="zip_code" defaultValue={usuario.zip_code} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="street">Street:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="street" name="street" defaultValue={usuario.street} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="ext_number">Ext number:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="ext_number" name="ext_number" defaultValue={usuario.ext_number} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="int_number">Int number:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="int_number" name="int_number" defaultValue={usuario.int_number} onChange={handleChange} />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                <Boton type='submit'>Aceptar</Boton>
                              </form>
                            </Contenido>
                          </Modal>

                          <ContenedorBotones>
                            <Boton onClick={()=>cambiarEstadoModal4(!estadoModal4)}>Cancelacion</Boton>
                          </ContenedorBotones>

                          <Modal
                            estado={estadoModal4}
                            cambiarEstado={cambiarEstadoModal4}
                            titulo="Cancelacion"
                          >
                            <Contenido>
                                <div class="tab-body">
                                  <p>By meanof the present and paying attetion to the ARCO rights with wich the user Rafael NIcolas Belloni Arcoreporting the Cancelation of his personal data</p>
                              
                                    <label for="">Cancelation cause by the user:</label>
                                    <textarea id="b-text" name="mensaje" rows="4" cols="40" value={comment} readOnly></textarea>

                                </div>
                                <Boton onClick={handleDeleteUser}>Aceptar</Boton>


                              </Contenido>
                          </Modal>

                          <ContenedorBotones>
                            <Boton onClick={()=>cambiarEstadoModal3(!estadoModal3)}>    Oposicion   </Boton>
                          </ContenedorBotones>

                          <Modal
                            estado={estadoModal3}
                            cambiarEstado={cambiarEstadoModal3}
                            titulo="Oposicion"
                          >
                            <Contenido>
                              <form onSubmit={handleSubmit}>
                                <div className="tab-body">
                                  <table className="form-table">
                                    <tbody>
                                      <tr>
                                        <td>
                                          <label for="name">Nombre:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="name" name="name" defaultValue={usuario.name} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="first_last_name">First Last Name:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="first_last_name" name="first_last_name" defaultValue={usuario.first_last_name} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="born_date">Born Date:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="born_date" name="born_date" defaultValue={usuario.born_date} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="nationality">Nationality:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="nationality" name="nationality" defaultValue={usuario.nationality} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="state_of_birth">State of Birth:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="state_of_birth" name="state_of_birth" defaultValue={usuario.state_of_birth} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="economic_activity">Economic Activity:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="economic_activity" name="economic_activity" defaultValue={usuario.economic_activity} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="curp">CURP:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="curp" name="curp" defaultValue={usuario.curp} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="phone_number">Phone:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="phone_number" name="phone_number" defaultValue={usuario.phone_number} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="email">Email:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="email" name="email" defaultValue={usuario.email} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="country">Country:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="country" name="country" defaultValue={usuario.country} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="state">State:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="state" name="state" defaultValue={usuario.state} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="city">City:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="city" name="city" defaultValue={usuario.city} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="neighborhood">Neighborhood:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="neighborhood" name="neighborhood" defaultValue={usuario.neighborhood} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="zip_code">Zip code:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="zip_code" name="zip_code" defaultValue={usuario.zip_code} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="street">Street:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="street" name="street" defaultValue={usuario.street} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="ext_number">Ext number:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="ext_number" name="ext_number" defaultValue={usuario.ext_number} onChange={handleChange} />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <label for="int_number">Int number:</label>
                                        </td>
                                        <td>
                                          <input type="text" id="int_number" name="int_number" defaultValue={usuario.int_number} onChange={handleChange} />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                <Boton type='submit'>Aceptar</Boton>
                              </form>
                            </Contenido>
                          </Modal>

                        </Contenido>
                      </Modal>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Requests;

const ContenedorBotones = styled.div`
	padding: 40px;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 20px;
`;

const Boton = styled.button`
	display: block;
	padding: 10px 30px;
	border-radius: 100px;
	color: #fff;
	border: none;
	background: rgb(0,0,0);
	cursor: pointer;
	font-family: 'Roboto', sans-serif;
	font-weight: 500;
	transition: .3s ease all;
  {/*margin: -30px;*/}
	&:hover {
		background: #778899;
	}
`;

const Contenido = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;

	h1 {
		font-size: 42px;
		font-weight: 700;
		margin-bottom: 10px;
	}

	p {
		font-size: 18px;
		margin-bottom: 20px;
	}

	img {
		width: 100%;
		vertical-align: top;
		border-radius: 3px;
	}
`
