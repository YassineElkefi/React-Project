import React, { useEffect, useState, useRef } from 'react'
import {MessageSquare, Heart,Share2, Smile, Trash2, Send, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: 'I am a nature enthusiast and software developer. I love creating eco-friendly applications and spending time in the great outdoors.',
    profilePicture: 'https://via.assets.so/img.jpg?w=150&h=150&tc=black&bg=#cecece'
  });
  const [userId, setUserId] = useState(0);
  const isFetchCalled = useRef(false);

  const navigate = useNavigate();

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
          
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }
    }, []);

    const staticPosts = [
      {
        id: 1,
        user: {
          id: 123,
          firstName: "Med Amine",
          lastName: "Ben Rhouma",
          profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        content: "البدايات ديما صعيبة، لكن اللي يميز الناس الناجحة هو الصبر والاستمرارية. الطريق لأي هدف يكون مليان تحديات وصعوبات، واللي يخلي الفرق هو كيفاش تتعامل معاهم. مع كل مشكلة تتعرضلها، تفتح قدامك فرصة جديدة للتعلم والنمو. كل عقبة ما هي إلا درس في المرونة والثقة بالنفس. المهم مش كيف تبدا، بل كيف تواصل وتآمن بقدرتك على التحسن. اللي يخدم بعقلية: اليوم خير من البارح، وغدوة خير من اليوم، هو اللي يوصل وين يحب. نهاركم طيب",
        timestamp: new Date(),
        likes: 4999,
        comments: [
          {
            id: 1, 
            userId: 456, 
            userName: "Jane Smith", 
            content: "Well said!", 
            timestamp: new Date(),
            profilePicture: "https://randomuser.me/api/portraits/women/1.jpg"
          }
        ],
        likedBy: []
      },
      {
        id: 2,
        user: {
          id: 456,
          firstName: "Jane",
          lastName: "Smith",
          profilePicture: "https://randomuser.me/api/portraits/women/1.jpg",
        },
        content: "Exploring the mountains has been on my bucket list for so long!",
        timestamp: new Date(),
        likes: 30,
        comments: [], // Initialize as empty array
        likedBy: []
      },
      {
        id: 3,
        user: {
          id: 789,
          firstName: "Mike",
          lastName: "Johnson",
          profilePicture: "https://randomuser.me/api/portraits/men/2.jpg",
        },
        content: "Loving the new features on this platform. Great job, devs!",
        timestamp: new Date(),
        likes: 22,
        comments: [], // Initialize as empty array
        likedBy: []
      },
    ];

    const handleLike = (postId) => {
      setAllPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const isLiked = post.likedBy.includes(userId);
            return {
              ...post,
              likes: isLiked ? post.likes - 1 : post.likes + 1,
              likedBy: isLiked 
                ? post.likedBy.filter(id => id !== userId)
                : [...post.likedBy, userId]
            };
          }
          return post;
        })
      );
    };

    const handleAddComment = (postId) => {
      if (newComment.trim()) {
        const comment = {
          id: Date.now(),
          userId: userId,
          userName: `${user.firstName} ${user.lastName}`,
          content: newComment,
          timestamp: new Date(),
          profilePicture: user.profilePicture
        };
  
        setAllPosts(prevPosts =>
          prevPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                comments: [comment, ...post.comments]
              };
            }
            return post;
          })
        );
        setNewComment('');
      }
    };

    const [allPosts, setAllPosts] = useState(staticPosts);
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
  
    const formatDateTime = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    const handleAddPost = (e) => {
      e.preventDefault();
      if (newPost.trim()) {
        const newPostData = {
          id: allPosts.length + 1,
          user: {
            id: userId,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicture: user.profilePicture,
          },
          content: newPost,
          likes: 0,
          comments: [], 
          likedBy: [],
          timestamp: new Date().toISOString(),
        };
        setAllPosts([newPostData, ...allPosts]);
        setNewPost('');
        setShowEmojis(false);
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
  
    const handleDeletePost = (postId) => {
      setAllPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    }

    const handleSaveEdit = (postId) => {
      setAllPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, content: editedContent } : post
        )
      );
      setEditPostId(null); // Exit edit mode
      setEditedContent(''); // Clear the edited content
    };

  return (
    <div className="h-full bg-green-50 px-4 sm:px-6 lg:px-8">
  <div className="w-full mx-auto pt-8 space-y-8">
    
    {/* Post Creation Area */}
    <div className="grid grid-cols-12 gap-8 mt-20">
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
      </div>
    </div>

    {/* Post Feed */}
    <div className="grid grid-cols-12 gap-8 pb-8">
          <div className="col-span-12 lg:col-start-4 lg:col-span-6 space-y-6">
            {allPosts.map((post) => (
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
                        {formatDateTime(post.timestamp)}
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
                      <p className="mt-2 text-gray-600">{post.content}</p>
                    )}
                    {/*<p className="mt-2 text-gray-600">{post.content}</p>*/}
                    <div className="mt-4 flex items-center space-x-4">
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
  )
}
