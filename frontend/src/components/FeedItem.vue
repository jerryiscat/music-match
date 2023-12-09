    <template>
        <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center space-x-6">
                <p>
                    <strong>
                        <RouterLink :to="{ name: 'profile', params: { id: post.user_id } }">{{ post.username }}</RouterLink>
                    </strong>
                </p>
            </div>

            
            <p class="text-gray-600"> 
                {{ formatDate(post.created_date) }}
            </p>
        </div>

        <p>{{ post.text }}</p>

        <div class="my-6 flex justify-between">
            <div class="flex space-x-6 items-center">
                <!--
                <div class="flex items-center space-x-2" @click="likePost(post.post_id)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"></path>
                    </svg>  
                    
                    <span class="text-gray-500 text-xs">{{ post.likes_count }} likes</span>
                </div>
                -->

                <div v-if="post.is_private" class="flex items-center space-x-2 text-gray-500 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>

                    <span>Is private</span>
                </div>
            </div>
            
            <div>
                <div @click="toggleExtraModal"
                v-if="userStore.user.id == post.user_id">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"></path>
                    </svg>
                </div>   
            </div>   
        </div>  

        <div v-if="showExtraModal">
            <div class="flex space-x-6 items-center">
                <div 
                    class="flex items-center space-x-2" 
                    @click="deletePost"
                    v-if="userStore.user.id == post.user_id"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-red-500">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
    
                    <span class="text-red-500 text-xs">Delete post</span>
                </div>
            </div>
        </div>
    </template>

    <script>
    import axios from 'axios'
    import { RouterLink } from 'vue-router'
    import { useUserStore } from '@/stores/user'
    import { useToastStore } from '@/stores/toast'

    export default {
        props: {
            post: Object
        },

        emits: ['deletePost'],

        setup() {
            const userStore = useUserStore()
            const toastStore = useToastStore()


            return {
                userStore,
                toastStore,
            }
        },

        data() {
            return {
                showExtraModal: false
            }
        },

        methods: {
            likePost(id) {
                axios
                    .post(`/api/posts/${id}/like/`)
                    .then(response => {
                        if (response.data.message == "like created") {
                            this.post.likes_count += 1;
                        }
                    })
                    .catch(error => {
                        console.log("error", error);
                    });
            },

            deletePost() {
                this.$emit('deletePost', this.post.post_id)

                axios
                    .delete(`/api/posts/${this.post_id}/delete/`)
                    .then(response => {
                        console.log(response.data)

                        this.toastStore.showToast(5000, 'The post was deleted', 'bg-emerald-500')
                    })
                    .catch(error => {
                        console.log("error", error);
                    })
            },

            formatDate(dateString) {
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-indexed
                const day = date.getDate().toString().padStart(2, '0'); // getDate() gives you the day of the month
                return `${year}-${month}-${day}`;
            },

            toggleExtraModal() {
                console.log('toggleExtraModal')

                this.showExtraModal = !this.showExtraModal
            }
        },
        components: { RouterLink }
    }
    </script>