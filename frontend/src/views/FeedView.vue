<template>
    <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
        <div class="main-center col-span-3 space-y-4">
            <div class="bg-white border border-gray-200 rounded-lg">
                <FeedForm 
                    v-bind:user= this.user 
                    v-bind:posts=posts
                />
            </div>

            <div 
                class="p-4 bg-white border border-gray-200 rounded-lg"
                v-for="post in posts"
                v-bind:key="post.post_id"
                key="componentKey"
            >
                <FeedItem v-bind:post=post v-on:deletePost="deletePost" />
            </div>
        </div>

        <div class="main-right col-span-1 space-y-4">
            <PeopleYouMayKnow />
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import PeopleYouMayKnow from '../components/PeopleYouMayKnow.vue'
import FeedItem from '../components/FeedItem.vue'
import FeedForm from '../components/FeedForm.vue'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue';

export default {
    name: 'FeedView',
    setup() {
        const userStore = useUserStore();
        return {
            userStore
        }
    },

    components: {
        PeopleYouMayKnow,
        FeedItem,
        FeedForm
    },

    data() {
        const componentKey = ref(0);
        const backend = import.meta.env.VITE_SERVER_URL;
        return {
            backend,
            posts: [],
            body: '',
            user: this.userStore.user,
            componentKey,
        }
    },

    mounted() {
        this.getFeed();
    },

    methods: {
        getFeed() {
            axios
                .get('/api/posts')
                .then(response => {
                    this.posts = response.data
                })
                .then(data => {
                    console.log('Response:', data);
                    this.forceRerender();
                })
                .catch(error => {
                    console.log('error', error.message)
                })
        },

        deletePost(id) {
            console.log("delete id");
            console.log(id);
            this.posts = this.posts.filter(post => post.post_id != id);
            fetch(`${this.backend}/api/posts/${id}/delete/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any additional headers if needed
                },
            })
            .then(response => {
                if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data); // Log the response from the server
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle the error, e.g., show an error message to the user
            });
        },
        forceRerender() {
            console.log(this.componentKey);
            this.componentKey += 1;
        },
    }
}
</script>