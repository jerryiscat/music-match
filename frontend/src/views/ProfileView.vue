<template>
    <div class="max-w-7xl mx-auto grid grid-cols-5 gap-4">

        <!-- left profile and actions -->
        <div class="main-left col-span-1 space-y-4">
            <div class="p-4 bg-white border border-gray-200 text-center rounded-lg">
                <img :src="'/头像.jpeg'" class="mb-6 rounded-full" @click="showProfile">
                
                <p><strong>{{ this.user.username }}</strong></p>

                <!-- <div class="mt-6 flex space-x-8 justify-around">
                    <RouterLink :to="{name: 'friends', params: {id: user.id}}" class="text-xs text-gray-500">{{ user.friends_count }} friends</RouterLink>
                    <Button class="text-xs text-gray-500" @click="showPosts">{{ user.posts_count }} posts</Button>
                </div> -->

                <div class="mt-6">

                    <!-- <button 
                        class="inline-block py-4 px-3 bg-purple-600 text-xs text-white rounded-lg" 
                        v-if="userStore.user.id !== user.user_id"
                    >
                        Add friendship
                    </button> -->

                    <!-- <button 
                        class="inline-block mt-4 py-4 px-3 bg-purple-600 text-xs text-white rounded-lg" 
                        @click="sendDirectMessage"
                        v-if="userStore.user.id !== user.id"
                    >
                        Send direct message
                    </button> -->

                    <!-- v-if="this.userStore.user.id === this.user.id" -->
                    <Button
                        class="inline-block mr-2 py-4 px-3 bg-purple-600 text-xs text-white rounded-lg" 
                        to="/profile/edit"
                        v-if="this.userStore.user.id == this.user.user_id"
                        @click="showEditProfile"
                    >
                        Edit Profile
                    </Button>
                    <button 
                        v-if="this.userStore.user.id == this.user.user_id"
                        class="inline-block py-4 px-3 bg-red-600 text-xs text-white rounded-lg" 
                        @click="logout"
                    >
                        Log Out
                    </button>
                </div>
            </div>   

        </div>

       
        <div class="main-right col-span-2 space-y-4">
            <!-- edit the profile -->
            <div class="p-4 bg-white border border-gray-200 rounded-lg"
                v-if="currentView === 'editProfile'"
            >
                <h1>Edit your profile</h1>
                <form @submit.prevent="submitForm">
                    <!-- Name -->
                    <div class="form-group">
                        <label for="name">Name:</label>
                        <input type="text" id="name" v-model="profile.name" required>
                        <span v-if="errors.name">{{ errors.name }}</span>
                    </div>

                    <!-- Age -->
                    <div class="form-group">
                        <label for="age">Age:</label>
                        <input type="number" id="age" v-model="profile.age" required>
                        <span v-if="errors.age">{{ errors.age }}</span>
                    </div>

                    <!-- MBTI -->
                    <div class="form-group">
                        <label for="mbti">MBTI:</label>
                        <select id="mbti" v-model="profile.mbti" required>
                            <option value="">Select MBTI Type</option>
                            <option v-for="type in mbtiTypes" :key="type" :value="type">
                                {{ type }}
                            </option>
                        </select>
                    </div>

                    <!-- Music Preferences -->
                    <div>
                        <label for="music">Favorite Music Genres:</label>
                        <div class="select-genre-container">
                            <div v-for="genre in Object.keys(musicGenres)" :key="genre">
                            <input 
                                type="checkbox" 
                                :value="genre" 
                                v-model="profile.selectedGenres"
                                :id="genre"
                            >
                            <label :for="genre">{{ genre }}</label>
                            </div>
                        </div>
                        <div class="genres-container">
                            <div 
                                class="genre-card" 
                                v-for="(genre, index) in profile.selectedGenres" 
                                :key="index"
                                :style="{ backgroundColor: getGenreColor(genre) }"
                            >
                                {{ genre }}
                            </div>
                        </div>
                        
                    </div>

                    <button 
                        type="submit" 
                        class="inline-block mt-4 py-4 px-3 bg-purple-600 text-xs text-white rounded-lg" 
                        @click="submitForm">
                        Submit
                    </button>
                </form>
            </div>

            <div class="p-4 bg-white border border-gray-200 rounded-lg"
                v-if="currentView === 'Profile'"
            >
                <h1>Profile</h1>
                    <!-- Name -->
                    <div class="form-group">
                        <p><strong>Name:</strong></p>
                        <p>{{ this.user.username }}</p>
                    </div>

                    <!-- Age -->
                    <div class="form-group">
                        <p><strong>Age:</strong></p>
                        <p>{{ this.user.age }}</p>
                    </div>

                    <!-- MBTI -->
                    <div class="form-group">
                        <p><strong>MBTI:</strong></p>
                        <p>{{ this.user.mbti }}</p>
                    </div>

                    <!-- Music Preferences -->
                    <div class="form-group">
                        <p><strong>Favorite Music Genres:</strong></p>
                        <p>{{ profile.genre }}</p>
                        <div class="genres-container">
                            <div 
                                class="genre-card" 
                                v-for="(genre, index) in profile.selectedGenres" 
                                :key="index"
                                :style="{ backgroundColor: getGenreColor(genre) }"
                            >
                                {{ genre }}
                            </div>
                        </div>
                    </div>

                    <div class="form-group"
                        v-if="this.userStore.user.id == this.user.user_id">
                        <p><strong>Music Introduction</strong></p>
                        <p>{{this.user.gpt_intro}}</p>
                    </div>
                   
            </div>

            <!-- check the user posts -->
            <div class="p-4 bg-white border border-gray-200 text-center rounded-lg"
                v-if="currentView === 'posts'"
            >
                <div 
                    class="bg-white border border-gray-200 rounded-lg"
                >
                    <FeedForm 
                        v-bind:user="user" 
                        v-bind:posts="posts"
                    />
                </div>

                <div 
                    class="p-4 bg-white border border-gray-200 rounded-lg"
                    v-for="post in posts"
                    v-bind:key="post.id"
                >
                    <FeedItem v-bind:post="post" v-on:deletePost="deletePost"/>
                </div>
            </div>
        </div>

        <div class="main-right col-span-2 space-y-4"  
            v-if="this.userStore.user.id == this.user.user_id">
            <div class="p-4 bg-white border border-gray-200 rounded-lg">
                <h1>GPT Music Introduction:</h1>
                <GPTIntroduction 
                    @setChatGPTIntro="setChatGPT"
                    v-bind:user=this.user 
                    v-bind:lastResponse=this.profile.gpt_intro
                />

                <button 
                        type="submit" 
                        class="inline-block mt-4 py-4 px-3 bg-purple-600 text-xs text-white rounded-lg" 
                        @click="submitGPTIntro">
                        Save
                </button>

            </div>
        </div>

        <div class="main-right col-span-2 space-y-4" 
            v-if="this.userStore.user.id != this.user.user_id">
            <div class="p-4 bg-white border border-gray-200 rounded-lg">
                <h1>GPT Music Introduction:</h1>
                <div class="chat-container">
                    <p>{{ this.user.gpt_intro }}</p>
                </div>
            </div>
        </div>

        

    </div>
</template>

<style>
input[type="file"] {
    display: none;
}

.custom-file-upload {
    border: 1px solid #ccc;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
}
</style>

<script>
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import FeedItem from '../components/FeedItem.vue'
import FeedForm from '../components/FeedForm.vue'
import GPTIntroduction from  '../components/GPTIntroduction.vue'

export default {
    name: 'Profile',

    setup() {
        const userStore = useUserStore()
        const toastStore = useToastStore()
    
        return {
            userStore,
            toastStore
        }
    },

    components: {
        FeedItem,
        FeedForm,
        GPTIntroduction 
    },

    data() {
        const frontend = import.meta.env.VITE_FRONTEND_URL;
        const backend = import.meta.env.VITE_SERVER_URL;
        return {
            gptIntro: "",
            currentView: 'Profile',
            frontend,
            backend,
            songs: [],
            posts: [],
            user: {
                user_id: null,
                email: '',
                username: '',
                gender: null,
                age: null,
                city: null,
                mbti: null,
                gpt_intro: null
            },
            can_send_friendship_request: null,
            profile: {
                name: this.userStore.user.name,
                avatar: this.userStore.user.avatar,
                age: this.userStore.user.age,
                mbti: this.userStore.user.mbti,
                selectedGenres: this.userStore.user.genres,
                gpt_intro: null
            },
            mbtiTypes: ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'],
            musicGenres : {
                'rock': '#ff6f61',       
                'pop': '#ffae42',         
                'jazz': '#6b2b65',        
                'classical': '#88b04b',  
                'hip hop': '#f7cac9',     
                'electronic': '#92a8d1',  
                'country': '#955251',     
                'reggae': '#b565a7',      
                'blues': '#034f84',      
                'metal': '#666666',       
                'folk': '#decbe4',        
                'R&B': '#ff7f50',         
                'punk': '#cb2d3e',       
                'latin': '#ff9f1c',       
                'indie': '#b1e9cf',       
                'soul': '#6b4226', 
                'chinese': '#cb3d1e',  
                'bebop': '#b527a1', 
            },
            errors: {
                name: '',
                age: ''
            }
        };
    },
    

    mounted() {
        this.getProfile();
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
            this.getSongs()
        }
    },

    watch: { 
        '$route.params.id': {
            handler: function() {
                this.getProfile()
            },
            immediate: true
        }
    },

    methods: {
        test() {
            console.log("this is the env");
            console.log(import.meta.env.VITE_FRONTEND_URL);
            console.log(import.meta.env.VITE_SERVER_URL);
        },
        showEditProfile() {
            this.currentView = 'editProfile';
        },
        showProfile() {
            this.currentView = 'Profile';
        },
        showPosts() {
            this.currentView = 'posts';
        },
        validateForm() {
            this.errors.name = this.profile.name ? '' : 'Name is required.';
            this.errors.age = this.profile.age ? '' : 'Age is required.';
            return this.errors.name === '' && this.errors.age === '';
        },

        submitGPTIntro() {
            axios
                .post(`/api/updateGPTIntro/${this.userStore.user.id}/`, {
                    gpt_intro: this.profile.gpt_intro
                })
                .then(response => {
                    console.log("this is the gpt_intro information: ");
                    console.log(response.data[0].gpt_intro);
                    this.user.gpt_intro = response.data[0].gpt_intro;
                    console("user info: " + this.user.gpt_intro)
                })
                .catch(error => {
                    console.error(error);
                });
        },
        async submitForm() {
            console.log('Profile Data:', this.profile);
            this.currentView = 'Profile';
            // this.userStore.setUserInfo(this.profile)
            // console.log(this.profile)
            const storedUserId = this.userStore.user.id

            axios
                .post(`/api/updateProfile/${storedUserId}/`, {
                    username: this.profile.name,
                    age: this.profile.age,
                    mbti: this.profile.mbti,
                    gpt_intro: this.profile.gpt_intro
                })
                .then(response => {
                    console.log("this is the profile information: ");
                    console.log(response.data);
                    this.user = response.data[0];
                    console("user info: " + this.user.gpt_intro)
                })
                .catch(error => {
                    console.error(error);
                });

        },

        deletePost(id) {
            this.posts = this.posts.filter(post => post.id !== id)
        },

        sendDirectMessage() {

            axios
                .get(`/api/chat/${this.$route.params.id}/`)
                .then(response => {
                    console.log(response.data)

                    this.$router.push('/chat')
                })
                .catch(error => {
                    console.log('error', error)
                })
        },


        getProfile() {
            axios
                .get(`/api/profile/${this.$route.params.id}/`)
                .then(response => {
                    console.log('data', response.data)
                    this.user = response.data
                    console.log('this user: ', this.user)
                    console.log('this user name: ', this.user.username)

                })
                .catch(error => {
                    console.log('error', error)
                })
        },

        getGenreColor(genre) {
            return this.musicGenres[genre] || '#d3d3d3'; // Default color if genre not in the list
        },

        logout() {
            console.log('Log out')

            this.userStore.removeToken()

            this.$router.push('/')
        }
    }
}
</script>

<style scoped>

h1 {
    font-size: x-large;
    font-weight: 500;
}
.profile-card {
  background-color: #fff;
  border: 1px solid #d3d3d3;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.profile-title {
  color: #5c4b99; /* Purple color */
  margin-bottom: 20px;
}

.profile-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1em;
}

.form-group label {
  display: block;
  margin-bottom: 0.5em;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group span {
  color: red;
  font-size: 0.8em;
}

.submit-button {
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #4b3f80; /* A darker shade of purple */
}

.select-genre-container {
    height: 100px;
    overflow-y: auto;
    border: 1px solid #ccc; 
    padding: 10px;
    margin: 20px 0;
}
.genres-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.genre-card {
  font-size: small;
  padding: 5px;
  border-radius: 5px;
  color: white;
  text-align: center;
}

.chat-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

</style>
