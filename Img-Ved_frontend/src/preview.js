import React, { useEffect } from 'react';
import './Preview.css';
import { useState } from "react";
// import { Link } from 'react-router-dom';


const Preview = () => {
  const [videoUrl, setVideoUrl] = useState("");

  const fetchVideo = async () => {
    try {
      const response = await fetch("http://localhost:3004/download"); // Change the URL to your API endpoint
      if (response.ok) {
        setVideoUrl(URL.createObjectURL(await response.blob()));
        console.log(videoUrl)
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };
  useEffect(() => {
    fetchVideo();
  }, []);
  return (
    <div className="mul-container">
      <h2>Preview of Your Video....</h2>
      {videoUrl && (
        <div className='video-container'>
          <video controls >
            <source src={videoUrl} type="video/mp4" />
          </video>
          {/* <div>
            <Link to={videoUrl} download="video.mp4">
              <button className='download-btn'>Download Video </button>
            </Link>
          </div> */}
        </div>
      )}
    </div>
    );
};

export default Preview;

