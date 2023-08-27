const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const googleTTS = require("google-tts-api");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
// const fetch = require('node-fetch');
// import fetch from "node-fetch";
// const dirp = __dirname+"\ffmpeg-6.0.tar.xz"
// ffmpeg.setFfmpegPath(dirp)
// ffmpeg.setFfprobePath(__dirname)
// ffmpeg.setFlvtoolPath(__dirname)

const app = express();
const PORT = process.env.PORT || 3004;

app.use(bodyParser.json());
app.use(cors());
const storage = multer.diskStorage({
  destination: "Uploads/", // Store uploaded images in the "Uploads" directory
  filename: (req, file, cb) => {
    cb(null, "outputimg.jpg");
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only image files are allowed."));
  }
};

const upload = multer({ storage, fileFilter });

// Handle image upload

app.post("/upload", upload.single("file"), async (req, res) => {
  const text =req.body.caption;
  // console.log(req.body.caption);
  if (!req.file) {
    return res.status(400).json({
      message: "No image uploaded",
    });
  }
  let path = req.file.path;
  path = __dirname + "\\" + path;


  try {
    const audioURL = googleTTS.getAudioUrl(text, {
      lang: "en",
      slow: false,
      host: "https://translate.google.com",
    });

    // Return the audio URL
    //     res.status(200).json({ audioURL });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ error: "Error generating audio" });
    //   }

    const response = await axios.get(audioURL, { responseType: 'arraybuffer' });
    const audioData = response.data;

    // Save the audio data to a file
    const audioFilePath = 'outputAud.mp3'; // Replace with your desired file path
    fs.writeFileSync(audioFilePath, audioData);

    // res.status(200).json({ message: 'Audio saved to file' });
  } catch (error) {
    console.error(error);
    // res.status(500).json({ error: "Error generating audio" });
  }



  // return res.status(200).json({
  //   message: "Image uploaded successfully",
  // });

 
  try {
    const imagePath = __dirname+`\\Uploads\\outputimg.jpg`;
    const audioPath = __dirname+`\\outputAud.mp3`; // Replace with the actual audio file path
    // const outputVideoPath = __dirname+"\\output.mp4";
    const outputVideoPath = 'output.mp4';
    // console.log(imagePath);
    // console.log(audioPath);
    // console.log(outputVideoPath);
    // Use ffmpeg to create a video from the image and audio
    ffmpeg()
      .input(imagePath)
      .input(audioPath)
      .size('640x480')
      // .outputOptions('-t 5') // Duration of the video (in seconds)
      .output(outputVideoPath)
      .on("end", () => {
        console.log("Video creation finished");
        res.status(200).json({
          message: "Video created successfully",
          videoPath: outputVideoPath,
        });
      })
      .on("error", (err) => {
        console.error("Error during video creation:", err);
        res.status(500).json({
          error: "Error during video creation",
        });
      })
      .run();
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({
      error: "Error uploading files",
    });
  }

  // try {
  //   const outputPath = __dirname+"\\output.mp4"; // Path for the output video
  //   const imagePath = __dirname+`\\Uploads\\outputimg.jpg`;
  //   const audioPath = __dirname+`\\outputAud.mp3`; // Replace with the actual audio file path

  //   // Use ffmpeg to create a video from the image and audio
  //   const cmd = `ffmpeg -loop 1 -i ${imagePath} -i ${audioPath} -c:v libx264 -tune stillimage -c:a aac -strict experimental -b:a 192k -pix_fmt yuv420p -shortest ${outputPath}`;

  //   exec(cmd, (error, stdout, stderr) => {
  //     if (error) {
  //       console.error("Error during video creation:", error);
  //       res.status(500).json({
  //         error: "Error during video creation",
  //       });
  //       return;
  //     }

  //     console.log("Video creation finished");
  //     res.status(200).json({
  //       message: "Video created successfully",
  //       videoPath: outputPath,
  //     });
  //   });
  // } catch (error) {
  //   console.error("Error uploading files:", error);
  //   res.status(500).json({
  //     error: "Error uploading files",
  //   });
  // }
});

app.get("/download",(req,res)=>{
    const videoPath = __dirname+"\\output.mp4"; 
    console.log(videoPath);// Replace with your video file path
    const videoFile = path.basename(videoPath);
  
    const videoStream = fs.createReadStream(videoPath);
    videoStream.pipe(res);
  
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", `inline; filename=${videoFile}`);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});