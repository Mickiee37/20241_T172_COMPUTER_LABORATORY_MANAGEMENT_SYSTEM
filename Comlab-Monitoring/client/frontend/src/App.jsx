import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import { IoPersonSharp } from "react-icons/io5";
import { RiComputerLine } from "react-icons/ri";
import { FaQrcode } from 'react-icons/fa'; // Import QR code icon from FontAwesome
import { MdHistory } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for navigation

const App = () => {
  const [instructors, setInstructors] = useState([]);
  const [newInstructor, setNewInstructor] = useState({ id: '', name: '', lastname: '', email: '' });
  const [newInstructorPut, setNewInstructorPut] = useState({ id: '', name: '', lastname: '', email: '' });
  const [deleteId, setDeleteId] = useState('');
  const [activeForm, setActiveForm] = useState(null);
  const navigate = useNavigate(); // React Router's useNavigate for redirection
  const handleLogout = () => {
    // Redirect to the usertype selection menu
    navigate('/');
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/instructor/");
      if (!response.ok) throw new Error("No internet connection");
      const data = await response.json();
      setInstructors(data);
    } catch (error) {
      console.error("Error fetching instructors", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInstructor((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    const pattern = /^[\w.%+-]+@(buksu)\.edu\.ph$/i;
    return pattern.test(email);
  };

  const handleAddInstructor = async (e) => {
    e.preventDefault();
    if (!validateEmail(newInstructor.email)) {
      console.error("Invalid email. Only '@buksu.edu.ph' emails are allowed.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/instructor/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInstructor)
      });
      if (!response.ok) throw new Error("Failed to add instructor");
      await fetchInstructors();
      setNewInstructor({ id: '', name: '', lastname: '', email: '' });
    } catch (error) {
      console.error("Error adding instructor", error);
    }
  };

  const handleInputChangePut = (e) => {
    const { name, value } = e.target;
    setNewInstructorPut((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(newInstructorPut.email)) {
      console.error("Invalid email. '@buksu.buksu.edu.ph' emails are allowed.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/instructor/${newInstructorPut.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInstructorPut)
      });
      if (!response.ok) throw new Error('Failed to update instructor');
      await fetchInstructors();
      setNewInstructorPut({ id: '', name: '', lastname: '',email: '' });
    } catch (error) {
      console.error('Error updating instructor', error);
    }
  };

  const handleDeleteChange = (e) => {
    setDeleteId(e.target.value);
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/instructor/${deleteId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete instructor');
      await fetchInstructors();
      setDeleteId('');
    } catch (error) {
      console.error('Error deleting instructor', error);
    }
  };

  const handleUpdateClick = (instructor) => {
    setActiveForm('update');
    setNewInstructorPut({
      id: instructor._id,
      name: instructor.name,
      lastname: instructor.lastname,
      email: instructor.email,
    });
  };
  
  const handleDeleteClick = (id) => {
    setActiveForm('delete');
    setDeleteId(id);
  };

  

  return (
    <div className="container mt-5">
         <nav className="navbar fixed-top navbar-expand-lg bg-black">
   <div className="container">
     {/* Left: Brand */}
     <a className="navbar-brand text-white">Computer Laboratory Monitoring System</a>
     {/* Center: Icons and Labels */}
     <div className="navbar-center">
     <Link to="/Dashboard" className="navbar-item">
   <RiComputerLine className="icon computer-icon" />
   <span className="icon-label">Computer Lab</span>
 </Link>
       <Link to="/app" className="navbar-item">
         <IoPersonSharp className="icon person-icon" />
         <span className="icon-label">Instructor Menu</span>
       </Link>
       <Link to="/qr-code" className="navbar-item">
         <FaQrcode className="icon qr-icon" />
         <span className="icon-label">QR Generator</span>
       </Link>
       <Link to="/qr-code" className="navbar-item">
        <MdHistory className="icon history-icon" />
        <span className="icon-label">History Log</span>
      </Link>
     </div>
     {/* Right: Logout Button */}
     <button className="logout-button" onClick={handleLogout}>
       Logout
     </button>
   </div>
 </nav>
    <br></br>
    <br></br>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1 className="Instructh1">Instructor Management</h1>
      <button className="btn btn-sm btn-primary" onClick={() => setActiveForm('add')}>Add Instructor</button>
      </div>
      <table className="table table-striped table-hover table-bordered mb-5">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
  {instructors.length > 0 ? (
    instructors.map((instructor) => (
      <tr key={instructor._id}>
        <td>{instructor._id}</td>
        <td>{instructor.name}</td>
        <td>{instructor.lastname}</td>
        <td>{instructor.email}</td>
        <td className="text-center"> 
          <button
            className="btn btn-warning btn-sm me-2"
            onClick={() => handleUpdateClick(instructor)}
          >
            <i className="fas fa-edit"></i> 
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDeleteClick(instructor._id)}
          >
            <i className="fas fa-trash-alt"></i> 
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="text-center">No instructors fetched</td>
    </tr>
  )}
        </tbody>
      </table>

      {/* Conditionally Render Forms */}
      {activeForm === 'add' && (
        <div className="mb-4">
          <h3>Add Instructor</h3>
          <form onSubmit={handleAddInstructor}>
            <input type="text" className="form-control mb-2" placeholder="ID" name="id" value={newInstructor.id} onChange={handleInputChange} />
            <input type="text" className="form-control mb-2" placeholder="Name" name="name" value={newInstructor.name} onChange={handleInputChange} required />
            <input type="text" className="form-control mb-2" placeholder="Last Name" name="lastname" value={newInstructor.lastname} onChange={handleInputChange} required />
            <input type="email" className="form-control mb-2" placeholder="Email" name="email" value={newInstructor.email} onChange={handleInputChange} required />
            <div className="text-center">
              <button type="submit" className="btn btn-primary btn-sm w-25">Add Instructor</button>
            </div>
          </form>
        </div>
      )}

      {activeForm === 'update' && (
        <div className="mb-4">
          <h3>Update Instructor</h3>
          <form onSubmit={handleUpdateSubmit}>
            <input type="text" className="form-control mb-2" placeholder="ID" name="id" value={newInstructorPut.id} onChange={handleInputChangePut} required />
            <input type="text" className="form-control mb-2" placeholder="Name" name="name" value={newInstructorPut.name} onChange={handleInputChangePut} required />
            <input type="text" className="form-control mb-2" placeholder="Last Name" name="lastname" value={newInstructorPut.lastname} onChange={handleInputChangePut} required />
            <input type="email" className="form-control mb-2" placeholder="Email" name="email" value={newInstructorPut.email} onChange={handleInputChangePut} required />
            <div className="text-center">
              <button type="submit" className="btn btn-warning btn-sm w-25">Update Instructor</button>
            </div>
          </form>
        </div>
      )}

      {activeForm === 'delete' && (
        <div className="mb-4">
          <h3>Delete Instructor</h3>
          <form onSubmit={handleDeleteSubmit}>
            <input type="text" className="form-control mb-2" placeholder="ID" value={deleteId} onChange={handleDeleteChange} required />
            <div className="text-center">
              <button type="submit" className="btn btn-danger btn-sm w-25">Delete Instructor</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
