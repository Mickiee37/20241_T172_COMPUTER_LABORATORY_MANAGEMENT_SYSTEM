import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import { IoPersonSharp } from "react-icons/io5";
import { RiComputerLine } from "react-icons/ri";
import { FaQrcode } from "react-icons/fa";
import { MdHistory } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const App = () => {
  const [instructors, setInstructors] = useState([]);
  const [newInstructor, setNewInstructor] = useState({ id: "", name: "", lastname: "", email: "" });
  const [newInstructorPut, setNewInstructorPut] = useState({ id: "", name: "", lastname: "", email: "" });
  const [deleteId, setDeleteId] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "ascending" });

  const navigate = useNavigate();

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

  const handleAddInstructor = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/instructor/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInstructor),
      });
      if (!response.ok) throw new Error("Failed to add instructor");
      await fetchInstructors();
      setNewInstructor({ id: "", name: "", lastname: "", email: "" });
      setActiveModal(null);
    } catch (error) {
      console.error("Error adding instructor", error);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/instructor/${newInstructorPut.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInstructorPut),
      });
      if (!response.ok) throw new Error("Failed to update instructor");
      await fetchInstructors();
      setActiveModal(null);
    } catch (error) {
      console.error("Error updating instructor", error);
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/instructor/${deleteId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete instructor");
      await fetchInstructors();
      setActiveModal(null);
    } catch (error) {
      console.error("Error deleting instructor", error);
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const filteredInstructors = instructors.filter((instructor) =>
    instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  

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
          <button className="logout-button">
            Logout
          </button>
        </div>
      </nav>
    <br></br>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h1 className="Instructh1">Instructor Management</h1>
      <button className="btn btn-primary mb-3" onClick={() => setActiveModal("add")}>
        Add Instructor
      </button>
      </div>
      <input
        type="text"
        className="form-controll mb-3"
        placeholder="Search by ID, First Name, Last Name, or Email"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      <table className="table table-striped table-hover table-bordered mb-5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInstructors.map((instructor) => (
            <tr key={instructor.id}>
              <td>{instructor.id}</td>
              <td>{instructor.name}</td>
              <td>{instructor.lastname}</td>
              <td>{instructor.email}</td>
              <td className="d-flex justify-content-center align-items-center">
  <button
    className="btn btn-warning btn-sm me-1" // me-1 for smaller space between buttons
    onClick={() => {
      setNewInstructorPut(instructor);
      setActiveModal("update");
    }}
  >
    <i className="fas fa-edit"></i>
  </button>
  <button
    className="btn btn-danger btn-sm"
    onClick={() => {
      setDeleteId(instructor.id);
      setActiveModal("delete");
    }}
  >
    <i className="fas fa-trash-alt"></i>
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>

      {activeModal === "add" && (
  <div className="modal show d-block" tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add Instructor</h5>
          <button className="btn-close" onClick={() => setActiveModal(null)}></button>
        </div>
        <div className="modal-body ">
          <form onSubmit={handleAddInstructor}>
            <input type="text" className="form-control mb-2" placeholder="ID" name="id" onChange={handleInputChange} required />
            <input type="text" className="form-control mb-2" placeholder="First Name" name="name" onChange={handleInputChange} required />
            <input type="text" className="form-control mb-2" placeholder="Last Name" name="lastname" onChange={handleInputChange} required />
            <input type="email" className="form-control mb-2" placeholder="Email" name="email" onChange={handleInputChange} required />
            <button type="submit" className="btn btn-primary">Add</button>
          </form>
        </div>
      </div>
    </div>
  </div>
)}

{/* Update Modal */}
{activeModal === "update" && (
  <div className="modal show d-block" tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Update Instructor</h5>
          <button className="btn-close" onClick={() => setActiveModal(null)}></button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleUpdateSubmit}>
            <input type="text" className="form-control mb-2" value={newInstructorPut.id} readOnly />
            <input type="text" className="form-control mb-2" placeholder="First Name" name="name" value={newInstructorPut.name} onChange={(e) => setNewInstructorPut({ ...newInstructorPut, name: e.target.value })} required />
            <input type="text" className="form-control mb-2" placeholder="Last Name" name="lastname" value={newInstructorPut.lastname} onChange={(e) => setNewInstructorPut({ ...newInstructorPut, lastname: e.target.value })} required />
            <input type="email" className="form-control mb-2" placeholder="Email" name="email" value={newInstructorPut.email} onChange={(e) => setNewInstructorPut({ ...newInstructorPut, email: e.target.value })} required />
            <button type="submit" className="btn btn-warning">Update</button>
          </form>
        </div>
      </div>
    </div>
  </div>
)}

{/* Delete Modal */}
{activeModal === "delete" && (
  <div className="modal show d-block" tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Delete Instructor</h5>
          <button className="btn-close" onClick={() => setActiveModal(null)}></button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete this instructor?</p>
          <button className="btn btn-danger" onClick={handleDeleteSubmit}>Delete</button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default App;
