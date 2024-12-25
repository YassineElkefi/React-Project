import React, { useEffect, useState, useRef } from 'react'
import {MessageSquare, Heart,Share2, Smile, Trash2, Send, Edit, UserPlus, Combine } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: 'I am a nature enthusiast and software developer. I love creating eco-friendly applications and spending time in the great outdoors.',
    profilePicture: 'https://via.assets.so/img.jpg?w=150&h=150&tc=black&bg=#cecece'
  });
  const [userId, setUserId] = useState(0);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [connectedUserDataId, setConnectedUserDataId] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const isFetchCalled = useRef(false);

  const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem("authToken");

        if(!token){
            navigate('/login')
        }
    }, [navigate]);

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

    // Fetch user data
    useEffect(() => {
      if(connectedUserDataId === null){
        return;
      }
      const fetchProfileUser = async () =>{
        try{
          const response = await fetch(`http://localhost:3001/api/v1/users/findById/${connectedUserDataId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const data = await response.json();
          setUser({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            bio: data.bio,
            profilePicture: data.profilePicture
          });
          setUserId(data.id);
          console.log('User Data:', data);
          
        }catch(err){
          console.error('Error fetching user data:', err);
        }
      };
      fetchProfileUser();
    }, [connectedUserDataId, userId]);

    //Fetch followed users
    useEffect(() => {
      if (connectedUserDataId === null) {
        return; // Exit the effect if connectedUserDataId is still null
      }
      
      const fetchFollowedUsers = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/v1/users/followedUsers/${connectedUserDataId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch followed users');
          }
          const data = await response.json();
          setFollowedUsers(data);
          console.log('Followed Users:', data);
        } catch (err) {
          console.error('Error fetching followed users:', err);
        }
      };
      fetchFollowedUsers();
    }, [connectedUserDataId]);
    


    /*useEffect(() => {
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
          
    
          
          const connectedUserResponse = await fetch(`http://localhost:3001/api/v1/users/findByEmail/${userEmail}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
    
          if (!connectedUserResponse.ok) {
            throw new Error('Failed to fetch user data');
          }
    
          const userData = await connectedUserResponse.json();
          setConnectedUserDataId(connectedUserResponse.id);
          console.log('Connected User Data id is : ', connectedUserDataId);
          setUser({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            bio:user.bio,
            profilePicture: user.profilePicture
          });
          setUserId(userData.id);
          console.log('User Data is : ', userData);
          
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }
    }, []);*/

    useEffect(() => {
      async function fetchSuggestedUsers() {
        try {
          const response = await fetch('http://localhost:3001/api/v1/users/findAllUsers', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch suggested users');
          }
          const data = await response.json();
          //Remove the connected user from the list and the !followedUsers
          if (followedUsers && data) {
            const followedUserIds = followedUsers.map(user => user.id);
            
            const filteredData = data.filter((user) => user.id !== userId && !followedUserIds.includes(user.id));
            setSuggestedUsers(filteredData);
            console.log(filteredData);
          }
        } catch (err) {
          console.error('Error fetching suggested users:', err);
        }
      }
  
      fetchSuggestedUsers();
    }, [userId, followedUsers]);

    useEffect(() => {
      const fetchPosts = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No auth token found");
          return;
        }
    
        try {
          // Fetch all posts
          const response = await fetch("http://localhost:3001/api/v1/posts/get-all-posts", {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
    
          if (!response.ok) {
            throw new Error("Failed to fetch posts");
          }
    
          const data = await response.json();
          console.log("All Posts:", data);
    
          // Ensure connectedUserDataId and post.user.id are valid
          const filteredPosts = data.filter((post) => {
            return (
              post.user.id === connectedUserDataId ||
              followedUsers.some(followedUser => followedUser.id === post.user.id)
            );
          });
    
          console.log("Filtered Posts:", filteredPosts);
    
          // Fetch comments and likes for filtered posts
          const postsWithDetails = await Promise.all(
            filteredPosts.map(async (post) => {
              const commentsResponse = await fetch(
                `http://localhost:3001/api/v1/comments/get-comments-post-id/${post.id}`,
                {
                  headers: {
                    "Authorization": `Bearer ${token}`,
                  },
                }
              );
              let comments = [];
              if (commentsResponse.ok) {
                comments = await commentsResponse.json();
              }
    
              const likesResponse = await fetch(
                `http://localhost:3001/api/v1/likes/get-likes-post-id/${post.id}`,
                {
                  headers: {
                    "Authorization": `Bearer ${token}`,
                  },
                }
              );
              let likes = 0;
              if (likesResponse.ok) {
                const likesData = await likesResponse.json();
                likes = likesData.length;
              }
    
              return { ...post, comments, likes };
            })
          );
    
          console.log("Posts with details:", postsWithDetails);
    
          setPosts(postsWithDetails);
        } catch (err) {
          console.error("Error fetching posts:", err);
        }
      };
    
      fetchPosts();
    }, [connectedUserDataId, followedUsers]);

    

    const [newPost, setNewPost] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);
    const [activeCommentPost, setActiveCommentPost] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [editPostId, setEditPostId] = useState(null);
    const [editedContent, setEditedContent] = useState('');

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
    // Add notification after successful like
    const handleLikePost = async (postId) => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error('No auth token found');
        return;
      }
    
      const likeData = {
        userId: userId,
        postId: postId,
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString('en-US', { hour12: false })
      };
    
      try {
        // First send the like request
        const response = await fetch('http://localhost:3001/api/v1/likes/like-post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(likeData)
        });
    
        if (response.ok) {
          // Get the post details to check the post owner
          const post = posts.find(p => p.id === postId);
          
          // Only send notification if the liker is not the post owner
          if (post && post.user.id !== userId) {
            // Fetch current user's details
            const userResponse = await fetch(`http://localhost:3001/api/v1/users/findById/${userId}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const userData = await userResponse.json();
            
            const notificationData = {
              recipientId: post.user.id, // Post owner
              senderId: userId, // Current user
              type: 'LIKE',
              content: `${userData.firstName} ${userData.lastName} liked your post`,
              postId: postId
            };
    
            // Send notification
            await fetch('http://localhost:3001/api/v1/notifications', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(notificationData)
            });
          }
        }
      } catch (error) {
        console.error('Error handling like:', error);
      }
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
          userId: userId
        };
    
        try {
          // First send the comment request
          const response = await fetch('http://localhost:3001/api/v1/comments/post-comment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(commentData)
          });
    
          if (response.ok) {
            // Get the post details to check the post owner
            const post = posts.find(p => p.id === postId);
            
            // Only send notification if the commenter is not the post owner
            if (post && post.user.id !== userId) {
              // Fetch current user's details
              const userResponse = await fetch(`http://localhost:3001/api/v1/users/findById/${userId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              const userData = await userResponse.json();

              const notificationData = {
                recipientId: post.user.id, // Post owner
                senderId: userId, // Current user
                type: 'COMMENT',
                content: `${userData.firstName} ${userData.lastName} commented on your post`,
                postId: postId
              };
      
              // Send notification
              await fetch('http://localhost:3001/api/v1/notifications', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(notificationData)
              });
            }
          }
        } catch (error) {
          console.error('Error handling comment:', error);
        }
      }
    };
    const handleSaveEdit = async (postId) => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error('No auth token found');
        return;
      }
    
      try {
        const response = await fetch(`http://localhost:3001/api/v1/posts/update-post/${postId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ description: editedContent })
        });
    
        if (response.ok) {
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === postId ? { ...post, description: editedContent } : post
            )
          );
          setEditPostId(null);
          setEditedContent('');
        } else {
          console.error('Failed to update post');
        }
      } catch (error) {
        console.error('Error updating post:', error);
      }
    };
  return (
    <div className="h-full bg-green-50 px-4 sm:px-6 lg:px-8">
  <div className="w-full mx-auto pt-8 space-y-8">
    {/* Main Contnet Area */}
    <div className="grid grid-cols-12 gap-8 pb-8">
    <div className="col-span-12 lg:col-span-9 space-y-6">
    {/* Create Post */}

    <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex space-x-4">
            <img
              src={user.profilePicture}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-2 border border-gray-200 rounded-lg resize-none"
              />
              <div className="flex items-center space-x-4 mt-4">
                <button
                  onClick={() => setShowEmojis(!showEmojis)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <Smile size={20} />
                </button>
                <button
                  onClick={handleAddPost}
                  className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Post
                </button>
              </div>
              {showEmojis && <EmojiPicker onSelect={insertEmoji} />}
            </div>
          </div>
        </div>
    {/* Post Feed */}
    <div className="grid grid-cols-12 gap-8 pb-8">
      
      
          <div className="col-span-12 lg:col-start-4 lg:col-span-6 space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-6 relative">
                {post.user.id === userId && (
                  <div className="absolute top-4 right-4 space-x-2 flex">
                    <button
                      onClick={() => { 
                        setEditPostId(post.id);
                        setEditedContent(post.description);
                      }}
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
                    src={post.user.profilePicture}
                    alt={post.user.firstName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        {post.user.firstName} {post.user.lastName}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {formatDateTime(post.date, post.time)}
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
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center space-x-2 transition-transform duration-200 hover:scale-110 
                        ${post.likes > 0 ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                    >
                      <Heart 
                        size={18} 
                        fill={post.likes > 0 ? "currentColor" : "none"}
                      />
                      <span>{post.likes || 0}</span>
                      </button>
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
                              src={comment?.profilePicture || 'https://via.placeholder.com/50'}
                              alt={`${comment.user.firstName}'s avatar`}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm">{comment.user.firstName} {comment.user.lastName}</span>
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
      {/* Peple you might know */}
      <div className="col-span-12 lg:col-span-3 space-y-6 mt-20 ">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">People You Might Know</h2>
              {suggestedUsers.length > 0 ? (
                suggestedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between mb-4 hover:bg-slate-200">
                    <Link to={`/profile/${user.id}`}>
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.profilePicture || 'https://via.placeholder.com/50'}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-xs text-gray-500">{user.bio}</p>
                      </div>
                    </div>
                    </Link>
                    {/*
                    <button
                      className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                      onClick={() => console.log(`Followed ${user.firstName}`)}
                    >
                      <UserPlus size={16} />
                    </button> */}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No suggestions available at the moment.</p>
              )}
            </div>
          </div>
        </div>
  </div>
</div>
  )
}
