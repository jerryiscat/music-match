<template>
  <div class="login-background flex items-center justify-center min-h-screen">
    <div class="overlay flex flex-col items-center justify-center min-h-screen">
      <div class="text-center p-12 bg-black bg-opacity-50 rounded-xl">
        <h1 class="text-5xl font-bold text-white mb-6">Welcome to Music Match</h1>
        <p class="text-xl text-white mb-6">Sign in to find music buddies!</p>
        <button 
          @click="login"
          class="bg-transparent border-none cursor-pointer"
        >
          <img src="/spotify-icon.png" alt="Sign in with Spotify" class="mx-auto" style="width: 50%;"> 
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '../spotify/getTopTrack.js';

export default {
  mounted() {
    // Check if user storage value exists
    const userValue = localStorage.getItem('user.id'); // Replace 'userKey' with the actual key you're using

    // Redirect if the value exists
    if (userValue) {
      console.log("enter the redirect:");
      this.$router.push({ name: 'feed' }); // Replace 'Feed' with the actual name or path of your feed route
    }
  },
  methods: {
      async login() {
        login();
      }
  }
}
</script>

<style>
.overlay {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-background {
  background-image: url('../../public/music.JPG');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
}
</style>