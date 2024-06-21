import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../actions/userAction';
import './registerPage.css';
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import { Link } from 'react-router-dom';
function RegisterPage() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState([]);
  const [password, setPassword] = useState('');
  const [legalInfo, setLegalInfo] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const role = 'unknown' 
  const handleProductImageChange = (e) => {
    const files = e.target.files[0];
    setFileToBase(files);
    // console.log(files)
  }


const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setAvatar(reader.result);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("position", position);
    formData.append("salary", salary);
    formData.append("gender", gender);
    formData.append("avatar", avatar);
    formData.append("nationalId", nationalId);
    formData.append("phoneNumber", phoneNumber);
    formData.append("legalInfo", legalInfo);
    formData.append("password", password); 
    formData.append('role', role);
console.log('form data: ',formData)    
    try {
      const response = await registerUser(formData);
      // Handle the response if needed
      console.log(response);
    } catch (error) {
      // Handle the error if needed
      console.error(error);
    }
  };

  return (
    <>
    <div className="wrapperr">
      <div className="Already-Have-Account">
      <label htmlFor="">I Already Have  Acount: </label>
      <Link to='/login'>
      <button>
      <KeyboardReturnOutlinedIcon />
      </button>
      </Link>
     
    </div>
    <div className="register-page">
      <h2>Register Workers..</h2> 
      <form onSubmit={handleSubmit} className="register-form">
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="avatar">Avatar:</label>
          <input
            type="file"
            id="avatar"
            onChange={handleProductImageChange}
            required
          />
        </div>
        <div>
          <label htmlFor="position">Position:</label>
          <input
            type="text"
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Enter position"
          />
        </div>
        <div>
          <label htmlFor="nationalId">National ID Number:</label>
          <input
            type="text"
            id="nationalId"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            placeholder="Enter national ID number"
          />
        </div>
        <div>
          <label htmlFor="salary">Salary:</label>
          <input
            type="number"
            id="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
            placeholder="Enter salary"
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number +212"
          />
        </div>
        <div>
          <label htmlFor="legalInfo">Legal Information:</label>
          <textarea
            id="legalInfo"
            value={legalInfo}
            onChange={(e) => setLegalInfo(e.target.value)}
            required
            placeholder="Enter legal information"
          ></textarea>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
    </div>
    </>
  );
}

export default RegisterPage;