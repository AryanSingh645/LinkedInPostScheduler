import './App.css'
import axios from "axios"
function App() {
  const handleAuth = async() => {
    const response = await axios.get('/auth/linkedin/getAuthorizationCode');
    if(response.data.success){
      window.location.href = response.data.redirectUrl;
    }
  }
  return (
    <button onClick={handleAuth}>log in</button>
  )
}

export default App
