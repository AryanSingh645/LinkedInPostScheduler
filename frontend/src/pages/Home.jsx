import React, { useEffect, useState } from 'react';
import { UserCircle2, LogOut, Sun, Moon, User } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { SchedulePostModal } from '../components/SchedulePostModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { ViewPostModal } from '../components/ViewPostModal';
import { useUser } from '../context/User';
import axios from 'axios';


// Mock data
const mockUser = {
  id: '1',
  name: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60'
};

// const mockPosts = [
//   {
//     id: '1',
//     images: [
//       'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&auto=format&fit=crop&q=60',
//       'https://images.unsplash.com/photo-1682687220742-aba19b51f319?w=800&auto=format&fit=crop&q=60'
//     ],
//     description: 'This is a sample post with a longer description that might need truncation. It contains multiple sentences to demonstrate how the text will be handled in the card view.',
//     scheduleTime: new Date(Date.now() + 86400000), // Tomorrow
//     visibility: 'PUBLIC'
//   },
//   {
//     id: '2',
//     images: [
//       'https://images.unsplash.com/photo-1682687220742-aba19b51f319?w=800&auto=format&fit=crop&q=60'
//     ],
//     description: 'Another post with different visibility settings.',
//     scheduleTime: new Date(Date.now() + 172800000), // Day after tomorrow
//     visibility: 'CONNECTIONS'
//   }
// ];

function Home() {
  const [isDark, setIsDark] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [deletePost, setDeletePost] = useState(null);
  const [viewPost, setViewPost] = useState(null);
  const [editPost, setEditPost] = useState(null);

  const {user} = useUser();

  const toggleTheme = () => {
    setIsDark(!isDark);
    setIsProfileOpen(false);
  };

  const handleLogout = async() => {
    const response = await axios.get('/auth/user/logout', {withCredentials: true});
    if(!response.data.success){
        console.log("Error logging out", response.data.message);
    } else {
        console.log("Logged out successfully");
    }
    window.location.href = '/signin';
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const getPostApi = async() => {
        // console.log("userid", user);
        const response = await axios.get('/auth/user/getDashBoardData', {withCredentials: true});
        console.log(response, "getPostApi response");
        if(!response.data.success){
            console.log("Error fetching posts", response.data.message);
        }
        else {
            setPosts(response.data.data.post);
        }
    }
    getPostApi();
  },[]);

  const handleSchedulePost = (formData) => {
    if (editPost) {
      // Update the existing post
      axios.put(`/api/posts/${editPost.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((response) => {
          const updatedPost = response.data;
          setPosts(posts.map((post) => (post.id === editPost.id ? updatedPost : post)));
          setEditPost(null); // Clear the edit state
        })
        .catch((error) => console.error('Error updating post:', error));
    } else {
      // Create a new post
      axios.post('/auth/user/schedulePost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }, withCredentials: true
      })
        .then((response) => {
          const newPost = response.data.data;
          setPosts([newPost, ...posts]);
        })
        .catch((error) => console.error('Error creating post:', error));
    }
  };

  const handleDeletePost = (post) => {
    setDeletePost(post);
  };

  const confirmDelete = () => {
    if (deletePost) {
      setPosts(posts.filter(p => p.id !== deletePost.id));
      setDeletePost(null);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`fixed top-0 right-0 m-4 z-10`}>
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg cursor-pointer"
          >
            <img
              src={user.picture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } ring-1 ring-black ring-opacity-5`}>
              <div className="py-1">
                <button
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    isDark ? 'text-gray-300 ' : 'text-gray-700 '
                  }`}
                >
                  {<User className="w-4 h-4 mr-2" />}
                  {user.name}
                </button>
                <button
                  onClick={toggleTheme}
                  className={`flex cursor-pointer items-center w-full px-4 py-2 text-sm ${
                    isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button
                  onClick={handleLogout}
                  className={`flex items-center cursor-pointer w-full px-4 py-2 text-sm ${
                    isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-20 pb-8">
        {/* Schedule Post Button */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
          >
            Schedule New Post
          </button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={setEditPost}
              onDelete={handleDeletePost}
              onView={setViewPost}
            />
          ))}
        </div>
      </main>

      {/* Modals */}
      <SchedulePostModal
        isOpen={isScheduleModalOpen || editPost !== null}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setEditPost(null);
        }}
        onSubmit={handleSchedulePost}
        post={editPost} // Pass the post being edited
      />

      <DeleteConfirmModal
        isOpen={deletePost !== null}
        onClose={() => setDeletePost(null)}
        onConfirm={confirmDelete}
      />

      <ViewPostModal
        post={viewPost}
        isOpen={viewPost !== null}
        onClose={() => setViewPost(null)}
      />
    </div>
  );
}

export default Home;