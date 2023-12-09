<template>
  <div class="chat-container">
    <button @click="sendQuery" class="send-button bg-purple-600">
      Create My Music Introduction
    </button>
    <div class="response-box">
      Response: <div v-if="chatResponse" class="response">{{ this.chatResponse  }}</div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    user: Object,
    lastResponse: String
  },
  
  data() {
    const backend = import.meta.env.VITE_SERVER_URL;
    return {
      backend,
      songs: 'Fast Animals by the Strokes, Disco 2000 by Pulp, Sugar Girl by The Cure',
      chatResponse: ''
    };
  },
  methods: {
    async sendQuery() {
      ``
      const messagePrompt = `I love those songs: Fast Animals by the Strokes, Disco 2000 by Pulp, and Sugar Girl by The Cure; please analyze my personality according to those songs and  write one paragraph for self-introduction. Don't include the song names directly. Include 10 emojis at the last whole line to represent my style, like this 'I am the kind of person who cherishes memories, finds beauty in introspection, and approaches life with an infectious zest. Whether we are discussing lyrics, sharing favorite tracks, or simply dancing to the rhythm of life, I'm here to make every moment unforgettable. Let's create our own musical journey together! 🎵📖🌟🕺💃🎉' My top tracks are ${this.songs}.`;

      // const messagePrompt = "hello"

      try {
        const url = `${this.backend}/api/gptintro`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: messagePrompt }),
        });
        
        if (response.ok) {
          const data = await response.text();
          this.chatResponse = data;
          // console.log(data);
          // Assuming this is inside a Vue component, you can use `this.$emit` to send the data to the parent component
          this.$emit("setChatGPTIntro", data);
        } else {
          console.error('Error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }

    },

  }
}
</script>

<style scoped>
.chat-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chat-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.send-button {
  width: 100%;
  padding: 10px;
  background-color: bg-purple-600;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-button:hover {
  background-color: rgb(113, 39, 183);;
}

.response {
  margin-top: 20px;
  padding: 10px;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.response-box {
  margin-top: 20px;
  padding: 10px;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.response {
  white-space: pre-line;
}

</style>


