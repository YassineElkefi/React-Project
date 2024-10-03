import './auth.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
      e.preventDefault();

      const registerData = { firstName, lastName, email, password };

      console.log(registerData);

      try {
          const response = await fetch("http://localhost:3001/api/v1/auth/register", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(registerData)
          });

          if (response.ok) {
              const result = await response.json();
              console.log("Registration successful:", result);
          } else {
              console.error("Registration failed");
          }
      } catch (error) {
          console.error("Error:", error);
      }
    };

  const navigate = useNavigate();

  return (
    <section className="text-center text-lg-start">
      <div className="container">
        <div className="row g-0 align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div className="card cascading-right">
              <div className="card-body p-5 shadow-5">
                <h2 className="fw-bold mb-5">Sign Up</h2>
                <form onSubmit={handleRegister}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="fname">First Name</label>
                        <input type="text" id="fname" className="form-control" onChange={(e) => setFirstName(e.target.value)} 
                                            value={firstName} required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="lname">Last Name</label>
                        <input type="text" id="lname" className="form-control" onChange={(e) => setLastName(e.target.value)} 
                                            value={lastName} required />
                      </div>
                    </div>
                  </div>

                  <div className="form-outline">
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input type="email" id="email" className="form-control" onChange={(e) => setEmail(e.target.value)} 
                                            value={email}  required />
                  </div>

                  <div className="form-outline">
                    <label className="form-label" htmlFor="password">Password</label>
                    <input type="password" id="password" className="form-control" onChange={(e) => setPassword(e.target.value)} 
                                            value={password}  required />
                  </div>

                  <button type="submit" className="btn btn-success btn-block mb-4">
                    Register
                  </button>
                </form>

                <p>Already a member? <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault(); 
            navigate('/');
          }} 
          className="link-success"
        >
          Sign in
        </a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
