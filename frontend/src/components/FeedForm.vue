<template>
    <form v-on:submit.prevent="submitForm" method="post">
        <div class="p-4">  
            <textarea v-model="body" class="p-4 w-full bg-gray-100 rounded-lg" placeholder="What are you thinking about?"></textarea>

            <label>
                <input type="checkbox" v-model="is_private"> Private
            </label>

            <div id="preview" v-if="url">
                <img :src="url" class="w-[100px] mt-3 rounded-xl" />
            </div>
        </div>

        <div class="p-4 border-t border-gray-100 flex justify-between">
            <button class="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg">Post</button>
        </div>
    </form>
</template>

<script>
import axios from 'axios'
import { ref } from 'vue';
import { useUserStore } from '@/stores/user'

export default {
    props: {
        user: Object,
        posts: Array
    },

    data() {
        const componentKey = ref(0);
        return {
            body: '',
            is_private: false,
            url: null,
            created_date: null,
            componentKey,
        }
    },

    methods: {
        submitForm() {
            console.log('submitForm', this.body)
            console.log('submitForm', this.user)
            console.log('submitForm', this.user.id)


            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            
            let formData = new FormData()
            formData.append('user_id', this.user.id)
            console.log(now.getTime())
            formData.append('created_date', formattedTime)
            formData.append('text', this.body)
            formData.append('is_private', this.is_private)


            axios
                .post('/api/posts/create', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
                .then(response => {
                    const userStore = useUserStore();
                    let data = response.data;
                    data["username"] = userStore.user.name;
                    console.log(data);
                    this.posts.unshift(response.data)
                    if (this.user) {
                        this.user.posts_count += 1
                    }
                })
                .then(data => {
                    console.log('Response:', data);
                    this.forceRerender();
                })
                .catch(error => {
                    console.log('error', error)
                })
        },
        forceRerender() {
            console.log(this.componentKey);
            this.componentKey += 1;
        },
    }
}
</script>