import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate,  } from 'react-router-dom';
import { Camera, Edit2, X, MessageSquare, Heart,Share2, Smile, Send, UserPlus, UserMinus } from 'lucide-react';


const OtherUserProfile = () => {

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        bio: 'I am a nature enthusiast and software developer. I love creating eco-friendly applications and spending time in the great outdoors.',
        profilePicture: 'https://via.assets.so/img.jpg?w=150&h=150&tc=black&bg=#cecece'
      });
    const navigate = useNavigate();
    const { userId } = useParams();
    const [posts, setPosts] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowing, setIsFollowing] = useState(null);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeCommentPost, setActiveCommentPost] = useState(null);
    const [newComment, setNewComment] = useState('');
    const isFetchCalled = useRef(false);
    const [connectedUserDataId, setConnectedUserDataId] = useState(null);

    useEffect(()=>{
      const token = localStorage.getItem("authToken");
  
      if(!token){
          navigate('/login')
      }
  }, [navigate]);

  // Second useEffect to fetch connected user data (based on token)
useEffect(() => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error('No auth token found');
    return;
  }

  const fetchConnectedUser = async () => {
    try {
      const profileResponse = await fetch('http://localhost:3001/api/v1/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const profileData = await profileResponse.json();
      const userEmail = profileData.email;

      const connectedUserResponse = await fetch(`http://localhost:3001/api/v1/users/findByEmail/${userEmail}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!connectedUserResponse.ok) {
        throw new Error('Failed to fetch connected user');
      }

      const connectedUserData = await connectedUserResponse.json();
      setConnectedUserDataId(connectedUserData.id);
      console.log('Connected User ID:', connectedUserData.id);
      
    } catch (error) {
      console.error('Error fetching connected user profile:', error);
    }
  };

  fetchConnectedUser();
}, []);


  // Third useEffect to fetch user data from API and check if the current user matches the connected user
useEffect(() => {
  if (connectedUserDataId === null) {
    return; // Wait until connectedUserDataId is set
  }

  const fetchProfileUser = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/users/findById/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const userData = await response.json();
      console.log('Fetched user data from API:', userData);

      setUser((prevUser) => ({
        ...prevUser,
        ...userData, // Overwrite the values that exist in userData
      }));
      setIsCurrentUser(userData.id === connectedUserDataId); // Compare only when connectedUserDataId is available
      console.log('Is the current user the same as the connected user?', userData.id === connectedUserDataId);

      // Check if the connected user is following the user of the profile
      setIsFollowing(userData.followers.some(follower => follower.id === connectedUserDataId));
      console.log('Is the connected user following the user of the profile?', isFollowing);     
      
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  fetchProfileUser();
}, [connectedUserDataId, userId]); // This effect depends on both connectedUserDataId and userId

// Fourth useEffect to fetch posts data from API of the user of the profile
useEffect(() => {
  if (isFetchCalled.current) {
    return;
  }
  const fetchPosts = async () => {
    const token = localStorage.getItem("authToken");
  if (!token) {
    console.error('No auth token found');
    return;
  }
    try {
      const postsResponse = await fetch(`http://localhost:3001/api/v1/posts/get-posts-user-id/${userId}`);
      if (postsResponse.ok) {
        const postsData = await postsResponse.json();

        // Fetch comments for each post
        const postsWithComments = await Promise.all(postsData.map(async (post) => {
          const commentsResponse = await fetch(`http://localhost:3001/api/v1/comments/get-comments-post-id/${post.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          let comments = [];
          if (commentsResponse.ok) {
            comments = await commentsResponse.json();
            console.log(`Comments for post ${post.id}:`, comments);
          } else {
            console.error(`Failed to fetch comments for post ${post.id}`);
          }

          return { ...post, comments };
        }));

        console.log('Posts with comments:', postsWithComments);
        

        setPosts(postsWithComments);
      } else {
        console.error('Failed to fetch posts');
      }
    }catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
    fetchPosts();
  }, [userId]);

  useEffect(() => {
    console.log('Updated posts:', posts); // Logs the state after it has been updated
  }, [posts]);


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

      const handleAddComment = async (postId) => {
        if (newComment.trim()) {
          const token = localStorage.getItem("authToken");
          if (!token) {
            console.error('No auth token found');
            return;
          }
      
          const commentData = {
            content: newComment,
            date: new Date().toISOString().slice(0, 10),
            time: new Date().toLocaleTimeString('en-US', { hour12: false }),
            postId: postId,
            userId: connectedUserDataId
          };
      
          try {
            const response = await fetch('http://localhost:3001/api/v1/comments/post-comment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(commentData)
            });
      
            if (response.ok) {
              const newCommentData = await response.json();
              
              // Update the posts state to include the new comment
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
              
              // Reset the new comment input
              setNewComment('');
              setActiveCommentPost(postId);
            } else {
              console.error('Failed to create comment');
            }
          } catch (error) {
            console.error('Error creating comment:', error);
          }
        }
      };

      // Follow/Unfollow user
      const handleFollowUnfollow = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error('No auth token found');
          return;
        }
    
        try {
          const response = await fetch(`http://localhost:3001/api/v1/users/${isFollowing ? 'unfollow' : 'follow'}/${connectedUserDataId}/${userId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
    
          if (response.ok) {
            setIsFollowing(!isFollowing);
          } else {
            console.error(`Failed to ${isFollowing ? 'unfollow' : 'follow'} user`);
          }
        } catch (error) {
          console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} user:`, error);
        }
      }

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
              <div className="space-y-6">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-semibold text-green-800">About</h2>
                  
                  <p className="text-gray-600">{user.bio}</p>
                </div>
                {/* Follow Button */}
                {!isCurrentUser && (
                <button
                  onClick={handleFollowUnfollow}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {isFollowing ? (
                    <>
                    <UserMinus size={18} className='mr-2'/>
                    <span>Unfollow</span>
                    </>
                  ): (
                    <>
                    <UserPlus size={18} />
                    <span>Follow</span>
                    </>
                  )
                }
                </button>
              )}
              </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-start-4 lg:col-span-6 space-y-6">
            {/* If there's no posts show a message */}
            {posts.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Smile size={48} className="text-green-500 mx-auto" />
                <p className="mt-4 text-gray-600">No posts to show</p>
              </div>
            )}

        {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-6 relative">
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
                    <p className="mt-2 text-gray-600">{post.description}</p>
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
                          src={comment.user.profilePicture || user.profilePicture}
                          alt={`${comment.user.firstName} ${comment.user.lastName}'s avatar`}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">
                              {comment.user.firstName} {comment.user.lastName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDateTime(comment.date, comment.time)}
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
  )
}

export default OtherUserProfile
