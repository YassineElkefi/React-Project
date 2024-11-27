import React, { useEffect, useRef, useState } from 'react';
import { Camera, Edit2, X, MessageSquare, Heart,Share2, Smile, Trash2, Send, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: 'I am a nature enthusiast and software developer. I love creating eco-friendly applications and spending time in the great outdoors.',
    profilePicture: 'https://via.assets.so/img.jpg?w=150&h=150&tc=black&bg=#cecece'
  });

  const EmojiPicker = ({ onSelect }) => {
    const emojis = ['😊', '😂', '🥰', '😎', '🤔', '👍', '❤️', '🎉', '🔥', '✨', 
                    '😭', '🥺', '😍', '🙌', '💪', '🌟', '💯', '🎸', '🌈', '☀️'];
    return (
      <div className="absolute bottom-full mb-2 bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <div className="grid grid-cols-5 gap-2 w-[240px]"> {/* Fixed width and increased gap */}
          {emojis.map((emoji, index) => (
            <button 
              key={index} 
              onClick={() => onSelect(emoji)} 
              className="p-2 hover:bg-gray-100 rounded flex items-center justify-center text-xl w-10 h-10" /* Fixed button dimensions */
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const formatDateTime = (dateString, timeString) => {
    // Parse the date part only
    const date = new Date(dateString);
  
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
  
    // Format the date
    const dateOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    };
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
  
    // Extract hour and minute from the time string (assuming format HH:MM:SS)
    const [hour, minute] = timeString.split(":");
    
    // Determine AM/PM and format the time
    const hour12 = (parseInt(hour) % 12) || 12;
    const ampm = parseInt(hour) >= 12 ? "PM" : "AM";
  
    const formattedTime = `${hour12}:${minute} ${ampm}`;
  
    return `${formattedDate} at ${formattedTime}`;
  };
                  

  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [userId, setUserId] = useState(0);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editPostId, setEditPostId] = useState(null);
    const [editedContent, setEditedContent] = useState('');
  const navigate = useNavigate();
  const isFetchCalled = useRef(false);



  useEffect(()=>{
    const token = localStorage.getItem("authToken");

    if(!token){
        navigate('/login')
    }
}, [navigate]);

useEffect(() => {
  if (!isFetchCalled.current) {
    isFetchCalled.current = true; 
    fetchUserData();
  }

  async function fetchUserData() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return;
    }

    try {
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
      

      
      const userResponse = await fetch(`http://localhost:3001/api/v1/users/findByEmail/${userEmail}`, {
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
      setUserId(userData.id);
      console.log('User Data is : ', userData);
      const postsResponse = await fetch(`http://localhost:3001/api/v1/posts/get-posts-user-id/${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        setPosts(postsData);
      } else {
        console.error('Failed to fetch user posts');
      } 
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(false);
    
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error('No auth token found');
      return;
    }

    const updateData = {
      firstName: user.firstName,
      lastName: user.lastName,
    };

    try {
      const response = await fetch(`http://localhost:3001/api/v1/users/updateById/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        console.log('Updated successfully');
      } else {
        console.error('Failed to update user data');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
/*
  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.likes?.includes(userId); // Check if likes includes the userId
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };
  */

  const handleAddComment = async (postId) => {
    if (newComment.trim()) {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error('No auth token found');
        return;
      }
  
      const commentData = {
        postId: postId,
        content: newComment,
        userId: userId
      };
  
      try {
        const response = await fetch('http://localhost:3001/api/v1/comments/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(commentData)
        });
  
        if (response.ok) {
          const newCommentData = await response.json();
          
          // Ensure the comment has a properly formatted date and time
          newCommentData.date = new Date().toISOString().slice(0, 10);
          newCommentData.time = new Date().toISOString().slice(11, 19);
          
          setPosts(prevPosts =>
            prevPosts.map(post => {
              if (post.id === postId) {
                return {
                  ...post,
                  comments: [newCommentData, ...post.comments]
                };
              }
              return post;
            })
          );
          setNewComment('');
        } else {
          console.error('Failed to create comment');
        }
      } catch (error) {
        console.error('Error creating comment:', error);
      }
    }
  };

  
  const handleAddPost = async (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error('No auth token found');
        return;
      }
  
      const postData = {
        description: newPost,
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toISOString().slice(11, 19),
        userId: userId
      };
  
      try {
        const response = await fetch('http://localhost:3001/api/v1/posts/create-post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(postData)
        });
  
        if (response.ok) {
          const newPostData = await response.json();

          newPostData.comments = newPostData.comments || [];

          setPosts([newPostData, ...posts]);
          setNewPost('');
          setShowEmojis(false);
        } else {
          console.error('Failed to create post');
        }
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }
  };
  const insertEmoji = (emoji) => {
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = newPost;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newText = before + emoji + after;
    setNewPost(newText);
    setShowEmojis(false);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error('No auth token found');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3001/api/v1/posts/delete-post/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  const handleSaveEdit = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, content: editedContent } : post
      )
    );
    setEditPostId(null); 
    setEditedContent(''); 
  };

  return (
    <div className="min-h-screen bg-green-50 px-4 sm:px-6 lg:px-8">
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

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-start-4 lg:col-span-6 space-y-6">

            <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleAddPost} className="space-y-4">
            <div className="relative">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows="3"
              />
              <div className="absolute bottom-2 left-2">
                <button
                  type="button"
                  onClick={() => setShowEmojis(!showEmojis)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                >
                  <Smile size={20} />
                </button>
                {showEmojis && <EmojiPicker onSelect={insertEmoji} />}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Post
              </button>
            </div>
          </form>
        </div>
        {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-6 relative">
                {post.user.id === userId && (
                  <div className="absolute top-4 right-4 space-x-2 flex">
                    <button
                      onClick={() =>{ setEditPostId(post.id)
                        setEditedContent(post.content);
                      }
                      }
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}
                <div className="flex items-start space-x-4">
                  <img
                    src={user.profilePicture}
                    alt={post.user.firstName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        {post.user.firstName} {post.user.lastName}
                      </h3>
                      <span className="text-sm text-gray-500">
                      <p>{formatDateTime(post.date, post.time)}</p>
                      {/*formatDateTime(post.timestamp)*/}
                      </span>
                    </div>
                    {editPostId === post.id ? (
                      <div className="mt-2">
                        <textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg resize-none"
                        />
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => handleSaveEdit(post.id)}
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditPostId(null)}
                            className="px-4 py-2 text-gray-600 border rounded-lg hover:text-gray-800"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-gray-600">{post.description}</p>
                    )}
                    {/*<p className="mt-2 text-gray-600">{post.content}</p>*/}
                    <div className="mt-4 flex items-center space-x-4">
                    <button 
                      className={`flex items-center space-x-2 transition-transform duration-200 hover:scale-110 text-gray-500 hover:text-red-500`}
                    >
                        <Heart 
                          size={18} 
                          //fill={post.likedBy.includes(userId) ? "currentColor" : "none"}
                        />
                        <span>{post.likes ? post.likes : "0"}</span>
                      </button>
                      {/* 
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-2 transition-transform duration-200 hover:scale-110 
                          ${post.likedBy.includes(userId) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                      >
                        <Heart 
                          size={18} 
                          fill={post.likedBy.includes(userId) ? "currentColor" : "none"}
                        />
                        
                        <span>{post.likes}</span>
                      </button>
                      */}
                      <button 
                        onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-transform duration-200 hover:scale-110"
                      >
                        <MessageSquare size={18} />
                        <span>{post.comments.length}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-transform duration-200 hover:scale-110">
                        <Share2 size={18} />
                      </button>
                    </div>

                    {/* Comments Section */}
                    {activeCommentPost === post.id && (
                    <div className="mt-4 space-y-4">
                      <div className="flex space-x-2">
                        
                        <div className="flex-1 flex space-x-2">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="p-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200"
                          >
                            <Send size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg">
                            <img
                              src={comment.profilePicture}
                              alt={`${comment.userName}'s avatar`}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm">{comment.userName}</span>
                                <span className="text-xs text-gray-500">
                                  {formatDateTime(comment.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
          </div>
        </div>
  );
};

export default Profile;
