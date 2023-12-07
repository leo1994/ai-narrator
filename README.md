# ChatGPT Vision and ElevenLabs

Someone at my work shared a Tweet about this [project here](https://github.com/cbh123/narrator), and I decided to make a clone in Node.JS


https://github.com/leo1994/ai-narrator/assets/11665444/0bc2c48a-5472-42aa-8147-957905ebca07


## Requirements

- Node v20.6.0
- ElevenLabs API Key (https://elevenlabs.io)
- OpenAI API Key (https://platform.openai.com/api-keys)

## How it works

The difference between my project and the original project is that I am using socket.io to Stream the audio to the client using Socket.io.
How it works is that the client uses the webcam and captures it, after which it converts the image to base64 and sends it to the server.
The server receives the image and sends it to the ChatGPT Vision API to get a description of the image based on the prompt. After that, it sends the description to the ElevenLabs API to get the audio file of the description, and finally, the server sends the audio file to the client using Socket.io.

## How to use

1. Clone the repo.
2. Run `npm install`.
3. Create a `.env` file using the `.env.example` file as a template.
4. Run `npm start:client` to start the client.
5. Run `npm start:server` to start the server.
6. Go to `http://localhost:8080` and enjoy!
