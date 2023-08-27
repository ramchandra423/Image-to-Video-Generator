import React, { useState } from 'react';
import './main.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LinearWithValueLabel from './progressbar';
import demo from './img/demo.png'

const UploadComponent = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showingImage, setShowingImage] = useState(null);
  //for caption
  const [caption, setCaption] = useState('');
  //progress bar
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();

  //funtion for handling image Changes.
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.includes('image')) {
      const reader = new FileReader();
      reader.onload = () => {
        setShowingImage(reader.result);
      };
      setSelectedImage(file);
      reader.readAsDataURL(file);
    }
  };

  //To handle the Caption
  const handleDataChange = (event) => {
    setCaption(event.target.value)
    console.log(event.target.value)
  }


  const formData = new FormData()
  formData.append("file", selectedImage);
  formData.append("caption", caption);

  // console.log(formData['file']);

  const Datasend = async () => {
    setIsVisible(true);
    try {
      const response = await axios.post('http://localhost:3004/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        },
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    navigate('/download')
  }



  return (
    <div className='main-container'>

      <div className='ctnr'>
        <div className='caption-box'>
          <textarea
            placeholder='Write Your caption Here..'
            // value={data}
            onChange={handleDataChange}
          ></textarea>
        </div>
        <input
          type='file'
          accept='image/*'
          name='myfile'
          onChange={handleImageChange}
        //   multiple
        ></input>
        <br />
        {selectedImage && (
          <div className='img-con'>
            <div className='chosen-img'>
              {/* <h4>Selected Image</h4> */}
              <img src={showingImage} alt='Uploaded'/>
            </div>
            <div>
              <div style={{ visibility: isVisible ? 'visible' : 'hidden' }} className='bar'>
                <LinearWithValueLabel value={uploadProgress} /> {/* Display progress here */}
              </div>
            </div>
          </div>
        )}
        <button className='btn' onClick={Datasend} >
          Proceed to Generate Video
        </button>
        {/* <hr></hr>
              <hr></hr> */}
        <h1>How to Convert Image and Text to Video</h1>
        <div className='demo-img'>
          <img src={demo}></img>
        </div>
        <div className='details'>
          <div className='deta'>
            <h3>1.Write Your Caption</h3>
            <p>Write any text that you want to play as background sound  of the Video.</p>
          </div>
          <div className='deta'>
            <h3>2.Upload Your Image</h3>
            <p>Upload an image which can be in Jpeg , Jpg , gif , Png in any format.</p>
          </div>
          <div className='deta'>
            <h3>3.Cick On Generate Video</h3>
            <p>Just Click On "Generate Video" and your final video will be processed into an MP4 file. Enjoy the new video you made with your image.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadComponent;