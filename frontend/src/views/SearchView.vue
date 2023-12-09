<template>
    <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
        <div class="main-left col-span-4 space-y-4">
            <div class="bg-white border border-gray-200 rounded-lg">
                <form v-on:submit.prevent="submitForm" class="p-4 flex space-x-4">  
                    <input v-model="query" type="search" class="p-4 w-full bg-gray-100 rounded-lg" placeholder="Who are you looking for?">

                    <button class="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
                        </svg>
                    </button>
                </form>
            </div>
            <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
        <div v-if="errorMessage" class="text-red-500">
            {{ errorMessage }}
        </div>
        <div class="main-left col-span-4 space-y-4">
        </div>
    </div>
            <div 
                class="p-4 bg-white border border-gray-200 rounded-lg grid grid-cols-4 gap-4"
                v-if="users.length"
            >
                <div 
                    class="p-4 text-center bg-gray-100 rounded-lg"
                    v-for="user in users"
                    v-bind:key="user.user_id"
                >
                   
                    <RouterLink :to="{name: 'profile', params:{'id': user.user_id}}"> <img :src="'/头像.jpeg'" class="mb-6 rounded-full"></RouterLink>
                    <p>
                        <strong>
                            <RouterLink :to="{name: 'profile', params:{'id': user.user_id}}">{{ user.username }}</RouterLink>
                        </strong>
                    </p>
                    <button 
                    v-if="user.user_id != user_id"
                    class="mt-2 py-1 px-3 bg-purple-500 text-white text-xs rounded-full hover:bg-blue-600"
                    @click="addFriend(user.user_id)"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 inline">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
                </div>
            </div>
        </div>
        <div class="col-span-4">
            <RecommendationView />
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import RecommendationView from '../components/RecommendationView.vue'
import { useToastStore } from '@/stores/toast'

export default {
    name: 'SearchView',
    components: {
        RecommendationView, 
    },

    data() {
        const userStore = useUserStore();
        const toastStore = useToastStore()
        const backend = import.meta.env.VITE_SERVER_URL;
        return {
            backend,
            query: '',
            users: [],
            errorMessage: '',
            user_id: userStore.user.id,
            toastStore,
        }
    },

    methods: {
    async submitForm() {
        this.errorMessage = '';
        if (!this.query.trim()) {
            this.errorMessage = 'Please enter a name to search.';
            return; 
        }

        console.log('Searching for:', this.query);

        try {
            const response = await axios.get(`${this.backend}/api/search`, { params: { query: this.query } });
            console.log('Search results:', response.data);
            this.users = response.data.users;
        } catch (error) {
            console.error('Search error:', error);
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
}
}
</script>
