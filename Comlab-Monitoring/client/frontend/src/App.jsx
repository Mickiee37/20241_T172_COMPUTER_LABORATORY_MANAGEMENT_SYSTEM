import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {

  const [instructors, setInstructors] = useState([]);

  const fetchInstructors = async () => {
    try{
      const response = await fetch("http://localhost:8000/api/instructor/");
      if(!response.ok){
        console.error("No internet connection");
      }
      const data = await response.json()
      setInstructors(data);
    }catch(error){
      console.error("Error fetching instructors", error)
    }
  }
  useEffect(() => {
    fetchInstructors()
  }, [])
  useEffect(() => {
    console.log(instructors);
  }, [instructors])

  // Email validation function
  const validateEmail = (email) => {
    const pattern = /^[\w.%+-]+@(student|buksu)\.edu\.ph$/i;
    return pattern.test(email);
  };

  //POST
  const [newInstructor, setNewInstructor] = useState({
    name:'',
    lastname:'',
    gender:'',
    email:''
  });

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setNewInstructor((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddInstructor = async (e) => {
    e.preventDefault();
    if (!validateEmail(newInstructor.email)) {
      console.error("Invalid email. Only '@student.buksu.edu.ph' or '@buksu.buksu.edu.ph' emails are allowed.");
      return;
    }
    try{
      const response = await fetch("http://localhost:8000/api/instructor/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newInstructor)
      });
      if(!response.ok){
        console.error("Failed to add ");
      }
      await fetchInstructors();
      setNewInstructor({name:'', lastname:'', gender:'',email:''});
    }catch(error){
      console.error("Error adding Instructor", error);
    }
  }

  //PUT
  const [newInstructorPut, setNewInstructorPut] = useState({
    id:'',
    name: '',
    lastname:'',
    gender:'',
    email:''
  });

  const handleInputChangePut = (e) => {
    const {name, value} = e.target;
    setNewInstructorPut((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    console.log('Updated state: ', newInstructorPut);
  }, [newInstructorPut]);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(newInstructorPut.email)) {
      console.error("Invalid email. Only '@student.buksu.edu.ph' or '@buksu.buksu.edu.ph' emails are allowed.");
      return;
    }
    try{
      const response = await fetch(`http://localhost:8000/api/instructor/${newInstructorPut.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInstructorPut)
      });
      console.log(newInstructorPut.gender)
      if(!response.ok){
        throw new Error('Failed to update instructor');
      }
      await fetchInstructors();
      setNewInstructorPut({name:'', lastname:'', gender:'',email:''});
    }catch(error){
      console.error('Error updating instructor: ', error)
    }
  };
  
  //DELETE
  const [deleteId, setDeleteId] = useState('');

  const handleDeleteChange = (e) => {
    setDeleteId(e.target.value);
  }

  const handleDeleteSubmit = async (e) =>{
    e.preventDefault();
    try{
      const response = await fetch(`http://localhost:8000/api/instructor/${deleteId}`, {
        method: 'DELETE'
      });
      if(!response.ok){
        throw new Error('Failed to delete instructor');
      }
      await fetchInstructors();
      setDeleteId('');
    }catch(error){
      console.error('Error deleting instructor', error);
    }
  };
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">Instructor Management</h1>

      <table className="table table-bordered mb-5">
        <thead>
          <tr >
            <th className='bg-light'>ID</th>
            <th className='bg-light'>Name</th>
            <th className='bg-light'>LastName</th>
            <th className='bg-light'>Gender</th>
            <th className='bg-light'>Email</th>
          </tr>
        </thead>
        <tbody>
          {
            instructors.length > 0 ? (
              instructors.map(instructors => (
              <tr key ={instructors.id}>
                <td>{instructors._id}</td>
                <td>{instructors.name}</td>
                <td>{instructors.lastname}</td>
                <td>{instructors.gender}</td>
                <td>{instructors.email}</td>
              </tr>
              ))
            ):( <tr><td colSpan="5">No instructor fetched</td></tr> )
          }
        </tbody>
      </table>

      <hr className="my-4" />

      <div className="row">
        {/* Add Instructor Form */}
        <div className="col-md-4">
          <h3>Add Instructor</h3>
          <form onSubmit={handleAddInstructor}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={newInstructor.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastname" className="form-label">LastName</label>
              <input
                type="text"
                className="form-control"
                id="lastname"
                name="lastname"
                value={newInstructor.lastname}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="gender" className="form-label">Gender</label>
              <select
                className="form-select"
                id="gender"
                name="gender"
                value={newInstructor.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="text"
                className="form-control"
                id="email"
                name="email"
                value={newInstructor.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Instructor</button>
          </form>
        </div>

        {/* Update Instructor Form */}
        <div className="col-md-4">
          <h3>Update Instructor</h3>
          <form onSubmit={handleUpdateSubmit}>  
            <div className="mb-3">
              <label htmlFor="updateId" className="form-label">Instructor ID</label>
              <input
                type="text"
                className="form-control"
                id="updateId"
                name="id"
                required
                value={newInstructorPut.id} 
                onChange={handleInputChangePut}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="updateName" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="updateName"
                name="name"
                value={newInstructorPut.name} 
                onChange={handleInputChangePut}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="updateName" className="form-label">LastName</label>
              <input
                type="text"
                className="form-control"
                id="updateLastname"
                name="lastname"
                value={newInstructorPut.lastname} 
                onChange={handleInputChangePut}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="updateGender" className="form-label">Gender</label>
              <select
                className="form-select"
                id="updateGender"
                name="gender"
                value={newInstructorPut.gender} 
                onChange={handleInputChangePut}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="updateSection" className="form-label">Email</label>
              <input
                type="text"
                className="form-control"
                id="updateSection"
                name="email"
                value={newInstructorPut.email} 
                onChange={handleInputChangePut}
              />
            </div>
            <button type="submit" className="btn btn-warning">Update</button>
          </form>
        </div>

        {/* Delete Instructor Form */}
        <div className="col-md-4">
          <h3>Delete Instructor</h3>
          <form onSubmit={handleDeleteSubmit}>
            <div className="mb-3">
              <label htmlFor="deleteId" className="form-label">Instructor ID</label>
              <input
                type="text"
                className="form-control"
                id="deleteId"
                value={deleteId}
                onChange={handleDeleteChange}
              />
            </div>
            <button type="submit" className="btn btn-danger">Delete</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
