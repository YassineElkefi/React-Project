import React, { useEffect, useRef, useState } from 'react';
import { Camera, Edit2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: 'I am a nature enthusiast and software developer. I love creating eco-friendly applications and spending time in the great outdoors.',
    profilePicture: 'https://via.assets.so/img.jpg?w=150&h=150&tc=black&bg=#cecece'
  });

  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const isFetchCalled = useRef(false);



  useEffect(()=>{
    const token = localStorage.getItem("authToken");

    if(!token){
        navigate('/login')
    }
}, [navigate]);

useEffect(() => {
  // Add a check to ensure fetchUserData is called only once
  if (!isFetchCalled.current) {
    isFetchCalled.current = true; // Set the flag to true
    fetchUserData();
  }

  async function fetchUserData() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return;
    }

    try {
      // First, fetch the user's email from the profile endpoint
      const profileResponse = await fetch('http://localhost:3001/api/v1/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const profileData = await profileResponse.json();
      const userEmail = profileData.email;

      // Then, use the email to fetch the full user data
      const userResponse = await fetch(`http://localhost:3001/api/v1/users/${userEmail}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      setUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        bio:user.bio,
        profilePicture: user.profilePicture
      });
      console.log('User Data is : ', userData);
      
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  }
}, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    console.log('Updated user data:', user);
  };

  return (
    <div className="h-full bg-green-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto pt-8 space-y-8">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-green-400 to-green-600">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="absolute bottom-0 left-36 right-0 p-6 text-white">
              <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
              <p className="text-sm mt-1 opacity-80">{user.email}</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-16 left-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
                <img src={user.profilePicture} alt={user.firstName} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 right-0 p-1 bg-green-500 rounded-full cursor-pointer">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-8 pt-20">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="fname" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="fname"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="lname" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="lname"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={user.bio}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <X size={16} className="mr-2" /> Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-semibold text-green-800">About me</h2>
                  <p className="text-gray-600">{user.bio}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Edit2 size={16} className="mr-2" /> Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
