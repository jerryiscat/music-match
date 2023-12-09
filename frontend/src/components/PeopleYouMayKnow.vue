<template>
  <section class="p-4 bg-white border border-gray-200 rounded-lg mb-4">
    <div class="flex justify-center">
      <h3 class="text-xl font-semibold mb-6">People You May Know</h3>
    </div>
    <div class="flex justify-center mb-4">
      <button @click="getRecommendations" class="p-2 bg-purple-600 text-white rounded hover:bg-blue-600 transition-colors">Get Recommendations</button>
    </div>
    
    <div v-if="users.length" class="space-y-4">
      <div v-for="user in users" :key="user.id" class="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm">
      <RouterLink :to="{ name: 'profile', params: { id: user.id } }" class="flex items-center space-x-3">
        <img :src="user.avatar || '/头像.jpeg'" class="w-10 h-10 rounded-full object-cover" :alt="`${user.name}'s avatar`">
        <p class="text-sm font-medium">{{ user.name }}</p>
      </RouterLink>
      <button 
        class="py-1 px-3 bg-purple-500 text-white text-xs rounded-full hover:bg-blue-600 flex items-center"
        @click="addFriend(user.id)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>     
    </div>
  </section>

  <section class="p-4 bg-white border border-gray-200 rounded-lg">
    <div v-if="songs.length">
      <div class="flex justify-center"></div>
      <h4 class="text-lg font-semibold mb-3">Top Tracks</h4>
    </div>
      <div class="grid grid-cols-2 gap-4">
        <div v-for="(song, index) in songs" :key="index" class="song-item">
        <img :src="song.album.images[0].url" :alt="song.name" />
        <p>{{ song.name }}</p>
        </div>
      </div>
  </section>
</template>

<script>
import { getTopSongs } from '../spotify/getTopTrack.js';
import axios from 'axios';
import { useUserStore } from "../stores/user";

export default {
    data() {
        const userStore = useUserStore();
        const backend = import.meta.env.VITE_SERVER_URL;
        return {
            backend,
            userStore,
            users: [],
            songs: [],
            user_id: userStore.user.id
        }
    },

    mounted() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
            this.getTopSongs(code);
        } else {
          this.songs = this.userStore.user.songs;
          console.log("those are songs");
          console.log(this.songs);
        }
    },



    methods: {
      async getTopSongs(code) {
        this.songs = await getTopSongs(code);

        this.userStore.setSongs(this.songs);
      },
      addFriend(friend) {
        const postData = {
            friends_id: friend,
            current_id: this.user_id
        };
        
        fetch(`${this.backend}/api/addFriend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
        .then(response => {
            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Response:', data);
            this.forceRerender();
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
    },
    forceRerender() {
        console.log(this.componentKey);
        this.componentKey += 1;
    },
  
    async getRecommendations() {
      const currentUserId = this.userStore.user.id;
      if (!currentUserId) {
        console.error("User ID is undefined");
        return;
      }
      try {
        const response = await axios.get(`${this.backend}/api/recommendations/${currentUserId}`);
        this.users = response.data.map(user => ({
          id: user.user_id, 
          name: user.username,
          avatar: user.avatar
        }));
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    }
  }
};
</script>