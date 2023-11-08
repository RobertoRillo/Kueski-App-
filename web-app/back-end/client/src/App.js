import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import MostrarDatos from './principal.js';
import "bootstrap/dist/css/bootstrap.min.css";
import logo from './kueskilogo.png';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [redirectToClient, setRedirectToClient] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (username === 'admin' && password === 'admin') {
      setRedirectToClient(true);
    } else {
      setErrorMessage('Usuario o contraseña incorrectos');
    }
  };

  if (redirectToClient) {
    return <MostrarDatos />;
  }


  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
      <div className="container">
        <img src={logo} alt="Logo" className="mx-auto d-block mb-4" style={{ width: '200px' }} />

        <Form onSubmit={handleSubmit} className="text-center">
          <Form.Group controlId="formUsername">
            <Form.Label className="mb-2">Usuario</Form.Label>
            <Form.Control type="text" placeholder="Ingrese su usuario" value={username} onChange={handleUsernameChange} className="mx-auto" style={{ width: '200px' }} />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label className="mt-2 mb-2">Contraseña</Form.Label>
            <Form.Control type="password" placeholder="Ingrese su contraseña" value={password} onChange={handlePasswordChange} className="mx-auto" style={{ width: '200px' }} />
          </Form.Group>

          {errorMessage && <p className="text-danger">{errorMessage}</p>}

          <Button variant="primary" type="submit" disabled={!username || !password} className="mx-auto mt-3">
            Iniciar sesión
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
