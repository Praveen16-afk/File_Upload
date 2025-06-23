import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import browse from './assets/browse.png'
import axios from 'axios'

function App() {
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [message, setMessage] = useState('')
  const [isUploadClicked, setIsUploadClicked] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isError, setIsError] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : ''
  }, [darkMode])

  function toggleTheme() {
    setDarkMode(prev => !prev)
  }

  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)
    setPreviews(selectedFiles.map((file) => URL.createObjectURL(file)))
  }

  function handleRemoveFile(indexToDelete) {
    const updatedFiles = files.filter((_, index) => index !== indexToDelete)
    const updatedPreviews = previews.filter((_, index) => index !== indexToDelete)
    setFiles(updatedFiles)
    setPreviews(updatedPreviews)
  }

  async function handleUpload(e) {
    if(files.length===0) {
      toast.error('Select files to upload')
      setMessage("No files selected to upload")
      setIsUploadClicked(true)
      setIsError(true)
      return;
    }
    setUploading(true)
    setIsUploadClicked(true)
    setUploadProgress(0)

    const formData = new FormData()
    files.forEach((file) => formData.append("images", file))
    setIsUploadClicked(true);

      try {
        const response = await axios.post("http://localhost:3000/upload/files", formData, {
          headers: {"Content-Type": "multipart/form-data"},
          onUploadProgress: (ProgressEvent) => {
            const percentCompleted = Math.round((ProgressEvent.loaded*100) / (ProgressEvent.total))
            setUploadProgress(percentCompleted)
          },
        })
        setMessage(response.data.message);
        setIsError(false)
        toast.success("Files uploaded successfully");
        } catch (err) {
        console.log(err.message)
        setIsError(true)
        toast.error("Failed to upload files")
        setMessage(err.response?.data?.message || "Upload failed")
      } finally {
        setUploading(false)
      }
}

  return (
    <div className='upload-container'>
      <button onClick={toggleTheme} className='upload-btn' style={{ float: 'right', marginBottom: '10px' }}>
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
      <h2>Build a File Upload App</h2>
      <div className='file-input-wrapper'>
        <input type='file' id='file-upload' multiple onChange={handleFileChange} className='file-input'/>
        <label htmlFor='file-upload' className='browse-btn'>
          <img src={browse} />
          Browse
        </label>
        <span className='file-count'>{files.length > 0 ? `${files.length} file(s)` : "No files Selected"}</span>
      </div>
      <div className='preview-container'>
        {previews.map((src, index) => (
          <div className='preview-wrapper' key={index}>
          <img src={src} alt="..." className="preview-image" />
          <button className='remove-btn' onClick={() => handleRemoveFile(index)}>x</button>
        </div>
        ))}
      </div>
      <button className='upload-btn' disabled={uploading} onClick={handleUpload}>{uploading ? "Uploading" : "Upload"}</button>
      {uploading && (
        <div className='progress-container'>
          <div className="progress-bar" style={{width: `${uploadProgress}%`}}></div>
          <span className="progress-text">{uploadProgress}</span>
        </div>)}
      {isUploadClicked && (<p className={`message ${isError ? "error" : "success"}`}>{message}</p>)}
       <ToastContainer position="top-center" autoClose={2000} theme={darkMode ? "dark" : "light"}/>
    </div>
  )
}

export default App
