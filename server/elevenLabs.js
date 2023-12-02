const ElevenLabs = require("elevenlabs-node");

module.exports = class ElevenLabsVoice {
  constructor() {
    if (!process.env.ELEVENLABS_API_KEY || !process.env.ELEVENLABS_VOICE_ID) {
      throw new Error(
        'Missing environment variables for ElevenLabs, please check ".env.example" file'
      );
    }

    this.voice = new ElevenLabs({
      apiKey: process.env.ELEVENLABS_API_KEY,
      voiceId: process.env.ELEVENLABS_VOICE_ID,
    });
  }

  async textToSpeechStream(text) {
    return this.voice.textToSpeechStream({
      textInput: text, // The text you wish to convert to speech

      stability: process.env.ELEVENLABS_VOICE_STABILITY ?? 0.5, // The stability for the converted speech
      similarityBoost: process.env.ELEVENLABS_VOICE_SIMILARITY_BOOST ?? 0.8, // The similarity boost for the converted speech
      style: process.env.ELEVENLABS_VOICE_STYLE ?? 0, // The style exaggeration for the converted speech
      speakerBoost: true, // The speaker boost for the converted speech
      modelId: process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2",
    });
  }
};
