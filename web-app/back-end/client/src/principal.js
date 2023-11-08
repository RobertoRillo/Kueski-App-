import './App.css';
import React ,{ useState,useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import logo from './kueskilogo.png';
import axios from 'axios';
import Requests from './componentes/Requests.js';
import SignIn from './App';
import './index.css';



function MostrarDatos() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  
  const [redirectToRequests, setRedirectToRequests] = useState(false);
  const [redirectToSignIn, setRedirectToSignIn] = useState(false);

  const handleSignInClick = () => {
    setRedirectToSignIn(true);
  };

  const handleRequestsClick = () => {
    setRedirectToRequests(true);
  };


  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };


  useEffect(() => {
    axios.get('/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (redirectToRequests) {
      return;
    }
    axios.get('/users')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [redirectToRequests]);

  const filteredData = data.filter(row => {
    return row.name.toString().toLowerCase().includes(search.toLowerCase());
  });

  if (redirectToRequests) {
    return <Requests />;
  }

  if (redirectToSignIn) {
    return <SignIn />;
  }
 

  return (
    <>
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
      <li><button >Clients</button></li>
      
      <li><button onClick={handleRequestsClick}>Requests</button></li>
    </ul>
    <div id="search" className="search-bar">

          <input type="text" placeholder="Search by name" value={search} onChange={handleSearchChange}/>
    </div>

    <div id="mtable">
    <table id="table" className="table  table-hover">
      <thead>
            <tr>
              <th>User Id</th>
              <th>Email</th>
              <th>Name</th>
              <th>First Last Name</th>
              <th>nationality</th>
              <th>CURP</th>
              <th>Phone Number</th>

            </tr>
          </thead>
          <tbody>
            {filteredData.map(row => (
              <tr key={row.user_id}>
                <td>{row.user_id}</td>
                <td>{row.email}</td>
                <td>{row.name}</td>
                <td>{row.first_last_name}</td>
                <td>{row.nationality}</td>
                <td>{row.curp}</td>
                <td>{row.phone_number}</td>

              </tr>
            ))}
          </tbody>
      
      </table>
    </div>
      </>
      
  );
}

export default MostrarDatos;
