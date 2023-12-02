// BEGIN: Webcam code
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then(function (stream) {
    // Display the webcam feed
    const video = document.getElementById("webcam");
    video.srcObject = stream;
    video.autoplay = true;
  })
  .catch(function (error) {
    console.log("Error accessing webcam:", error);
  });
// END: Webcam code

// BEGIN: Audio code
const audio = document.getElementById("audioElement");
const mediaSource = new MediaSource();
audio.src = URL.createObjectURL(mediaSource);
let sourceBuffer;
let audioQueue = [];

mediaSource.addEventListener("sourceopen", function () {
  sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
  sourceBuffer.addEventListener("updateend", function () {
    processQueue();
  });
});

audio.onended = function () {
  console.log("Audio playback ended");
  audio.pause();
};

const processQueue = () => {
  if (sourceBuffer.updating || audioQueue.length === 0) {
    return;
  }
  const nextAudioChunk = audioQueue.shift();
  sourceBuffer.appendBuffer(nextAudioChunk);
};
// END: Audio code

// BEGIN: Socket.io code
const socket = io("http://localhost:3000");

socket.on("connect", function () {
  console.log("Connected to server");
});

socket.on("narratorText", function (text) {
  console.log("🎙️ {Narrator} says:", text);
  displayNarratorText(text);
});

socket.on("narratorAudio", function (audioChunk) {
  console.log("🎙️ {Narrator} is speaking");
  audio.play();
  audioQueue.push(audioChunk);
  processQueue();
});

socket.on("narratorFinished", function () {
  startNarrator();
});

// END: Socket.io code

// BEGIN: Narrator code

const captureImage = () => {
  const video = document.getElementById("webcam");
  // Create a canvas
  const canvas = document.createElement("canvas");
  const MAX_SIZE = 250;

  // Calculate the new dimensions while maintaining aspect ratio
  let newWidth, newHeight;
  if (video.videoWidth > video.videoHeight) {
    newWidth = MAX_SIZE;
    newHeight = (video.videoHeight / video.videoWidth) * MAX_SIZE;
  } else {
    newWidth = (video.videoWidth / video.videoHeight) * MAX_SIZE;
    newHeight = MAX_SIZE;
  }

  canvas.width = newWidth;
  canvas.height = newHeight;

  // Draw the resized video frame to the canvas
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, newWidth, newHeight);

  // Get the resized image dataURL
  const imageDataURL = canvas.toDataURL("image/jpeg");
  console.log("📸 Image captured");

  return imageDataURL;
};

const sendImageToServer = (imageDataURL) => {
  console.log("📸 Sending image to server");
  socket.emit("capturedFrame", imageDataURL);
  console.log("📸 Image sent to server");
};

const displayNarratorText = (text) => {
  const paragraph = document.getElementById("narratorText");
  paragraph.innerText = paragraph.innerText + "\n" + text + "\n";

  // show the text on the page fade in
  const textContainer = document.getElementById("narratorContainer");
  textContainer.appendChild(paragraph);

  // fade in the text
  setTimeout(() => {
    paragraph.style.opacity = 1;
  }, 100);

  // scroll to the last line
  paragraph.scrollTop = paragraph.scrollHeight;
};

const startNarrator = () => {
  console.log("🎙️ {Narrator} is starting");
  const imageDataURL = captureImage();
  sendImageToServer(imageDataURL);
  button.style.opacity = 0;

  setTimeout(() => {
    button.style.display = "none";
  }, 300);
};

const button = document.getElementById("button");

button.addEventListener("click", startNarrator);
