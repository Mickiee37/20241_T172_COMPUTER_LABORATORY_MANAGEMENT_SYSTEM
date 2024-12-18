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
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false); // State to control toast visibility
  const [toastMessage, setToastMessage] = useState(""); // Dynamic message for the toast
   // Pagination state
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 5; // Number of items per page
   const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });

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
      const response = await fetch("http://192.168.194.244:8000/api/instructor/");
      if (!response.ok) throw new Error("No internet connection");
      const data = await response.json();
      setInstructors(data);
    } catch (error) {
      console.error("Error fetching instructors", error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key, direction });
  };
  const sortedInstructors = [...instructors].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });
  

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
      const response = await fetch("http://192.168.194.244:8000/api/instructor/", {
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
        console.error("Invalid email. '@buksu.edu.ph' emails are allowed.");
        return;
    }
    try {
        const response = await fetch(`http://192.168.194.244:8000/api/instructor/${newInstructorPut.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newInstructorPut) // Send version in the request
        });

        if (response.status === 409) {
            alert("Conflict detected: This record was updated by someone else. Please reload and try again.");
        } else if (!response.ok) {
            throw new Error('Failed to update instructor');
        }

        await fetchInstructors();
        setNewInstructorPut({ id: '', name: '', lastname: '', email: '', version: 0 });
    } catch (error) {
        console.error('Error updating instructor:', error);
    }
};
  const handleDeleteChange = (e) => {
    setDeleteId(e.target.value);
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://192.168.194.244:8000/api/instructor/${deleteId}`, {
        method: 'DELETE',
      });
  
      if (response.status === 404) {
        setToastMessage("Instructor has already been deleted by another admin.");
        setShowToast(true); // Show the toast
        return;
      }
  
      if (!response.ok) throw new Error("Failed to delete instructor");
  
      await fetchInstructors();
      setDeleteId('');
    } catch (error) {
      console.error("Error deleting instructor", error);
      setToastMessage("An error occurred while deleting the instructor.");
      setShowToast(true);
    }
  };
  const handleUpdateClick = (instructor) => {
    setActiveForm('update');
    setNewInstructorPut({
        id: instructor.id,
        name: instructor.name,
        lastname: instructor.lastname,
        email: instructor.email,
        version: instructor.version, // Include version field
    });
};
  const handleDeleteClick = (id) => {
    setActiveForm('delete');
    setDeleteId(id);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  // Filter instructors based on search query
  const filteredInstructors = sortedInstructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

   // Pagination logic
   const indexOfLastInstructor = currentPage * itemsPerPage;
   const indexOfFirstInstructor = indexOfLastInstructor - itemsPerPage;
   const currentInstructors = filteredInstructors.slice(indexOfFirstInstructor, indexOfLastInstructor);

  return (
    <div className="container mt-5">
  {/* Navbar */}
  <nav className="navbar fixed-top navbar-expand-lg bg-black">
    <div className="container">
      <a className="navbar-brand text-white">Computer Laboratory Monitoring System</a>
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
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  </nav>

  {/* Page Content */}
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h1 className="Instructh1">Instructor Management</h1>
    <button className="btn btn-sm btn-primary" onClick={() => setActiveForm('add')}>Add Instructor</button>
  </div>

  {/* Toast Notification */}
  <div
    className={`toast position-fixed bottom-0 end-0 m-3 ${showToast ? "show" : ""}`}
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    style={{ zIndex: 9999 }}
  >
    <div className="toast-header">
      <strong className="me-auto">Notification</strong>
      <small>Just now</small>
      <button
        type="button"
        className="btn-close"
        onClick={() => setShowToast(false)} // Close the toast
        aria-label="Close"
      ></button>
    </div>
    <div className="toast-body">
      {toastMessage}
    </div>
  </div>

  {/* Table */}
  <div className="table-wrapper">
    <table className="table table-striped table-hover table-bordered mb-5">
      <thead className="table-light">
        <tr>
          <th onClick={() => handleSort('id')}>ID</th>
          <th onClick={() => handleSort('name')}>Name</th>
          <th onClick={() => handleSort('lastname')}>Last Name</th>
          <th onClick={() => handleSort('email')}>Email</th>
        </tr>
      </thead>
      <tbody>
        {currentInstructors.length > 0 ? (
          currentInstructors.map((instructor) => (
            <tr key={instructor.id}>
              <td>{instructor.id}</td>
              <td>{instructor.name}</td>
              <td>{instructor.lastname}</td>
              <td>{instructor.email}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleUpdateClick(instructor)}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteClick(instructor.id)}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center">No instructors found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredInstructors.length / itemsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Conditionally Render Forms */}
      {activeForm && (
        <div className="fixed-form-container">
          <button className="close-button" onClick={() => setActiveForm(null)}>X</button>
          {activeForm === 'add' && (
  <div className="mb-4">
    <h3>Add Instructor</h3>
    <form onSubmit={handleAddInstructor}>
      <div className="form-row">
        <div className="form-column">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="ID"
            name="id"
            value={newInstructor.id}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="First Name"
            name="name"
            value={newInstructor.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-column">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Last Name"
            name="lastname"
            value={newInstructor.lastname}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            className="form-control mb-2"
            placeholder="Email"
            name="email"
            value={newInstructor.email}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
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
      <div className="form-row">
        <div className="form-column">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="ID"
            name="id"
            value={newInstructorPut.id}
            onChange={handleInputChangePut}
            readOnly
            required
            />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="First Name"
            name="name"
            value={newInstructorPut.name}
            onChange={handleInputChangePut}
            required
          />
        </div>
        <div className="form-column">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Last Name"
            name="lastname"
            value={newInstructorPut.lastname}
            onChange={handleInputChangePut}
            required
          />
          <input
            type="email"
            className="form-control mb-2"
            placeholder="Email"
            name="email"
            value={newInstructorPut.email}
            onChange={handleInputChangePut}
            required
          />
        </div>
      </div>
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
                <input type="text" className="form-control mb-2" placeholder="ID" value={deleteId} onChange={handleDeleteChange} readOnly required />
                <div className="text-center">
                  <button type="submit" className="btn btn-danger btn-sm w-25">Delete Instructor</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
