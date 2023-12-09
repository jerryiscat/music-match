<template>
  <div class="max-w-7xl mx-auto py-6">
    <!-- Recommendations Section -->
    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <h3 class="text-xl font-semibold mb-4 text-center">Music Buddies with similar taste</h3>
      
      <!-- Recommendations List -->
      <div class="flex justify-center space-x-4 overflow-x-auto py-4">
        <template v-if="users.length" v-for="user in users" :key="user.id">
          <div class="flex flex-col items-center">
            <RouterLink :to="{name: 'profile', params:{'id': user.id}}"><img :src="user.avatar || '/public/头像.jpeg'" class="w-16 h-16 rounded-full object-cover" :alt="`${user.name}'s avatar`"></RouterLink>
            <p class="mt-2 text-sm font-medium">{{ user.name }}</p>
            <button 
              v-if="user.id !== user_id"
              class="mt-2 py-1 px-3 bg-purple-500 text-white text-xs rounded-full hover:bg-blue-600"
              @click="addFriend(user.id)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 inline">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </template>
        <template v-else>
          <p>No recommendations available at the moment.</p>
        </template>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import axios from 'axios'
  import { useUserStore } from '@/stores/user'
  
  export default {
    name: 'RecommendationView',
    
    data() {
      const userStore = useUserStore();
      const backend = import.meta.env.VITE_SERVER_URL;
      return {
        backend,
        users: [], 
        user_id: userStore.user.id 
      }
    },
    
    methods: {
      async getRecommendations() {
        const userStore = useUserStore();
      const currentUserId = userStore.user.id;
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
    }
    },
    
    mounted() {
      this.getRecommendations();
    }
  };
  </script>
  
