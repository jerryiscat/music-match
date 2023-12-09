<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Contact List with Header -->
    <aside class="w-1/4 bg-white p-4 border-r overflow-auto">
      <h3 class="text-xl font-semibold mb-4 border-b pb-2">Contacts</h3>
      <template v-if="!users.length">
        <p class="text-gray-600">
          You don't have any friends now, search to add one!
        </p>
      </template>
      <template v-for="user in users" :key="user.id">
        <div 
          @click="getMessages(user.conversation_id)"
          class="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
          :class="{ 'bg-gray-200': conversation === user.conversation_id }"
        >
          <img src="/头像.jpeg" alt="User avatar" class="w-10 h-10 rounded-full mr-2">
          <p class="text-sm font-bold">{{ user.name }}</p>
        </div>
      </template>
    </aside>

    <!-- Chat Section -->
    <section class="w-3/4 flex flex-col" v-if="conversation !== -1">
      <!-- Active Chat Header -->
      <header class="bg-white p-4 shadow flex-none">
        <h2 class="text-xl font-bold">{{ activeFriend ? activeFriend.name : 'Select a conversation' }}</h2>
      </header>

      <!-- Messages List -->
      <div class="flex-grow overflow-auto p-4 space-y-4">
        <template v-if="activeFriend && messages.length">
          <template v-for="message in messages" :key="message.id">
            <div 
              class="flex items-end"
              :class="{ 'justify-end': message.user_id == userStore.user.id, 'justify-start': message.user_id != userStore.user.id }"
            >
              <div class="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl">
                <div 
                  class="inline-block rounded-lg p-3"
                  :class="{ 'bg-purple-600 text-white': message.user_id == userStore.user.id, 'bg-gray-300': message.user_id != userStore.user.id }"
                >
                  <p>{{ message.content }}</p>
                </div>
                  <p class="text-xs text-gray-500 mt-1">{{ Math.floor((new Date() - new Date(message.time)) / (1000 * 60)) }} mins ago</p>

              </div>
            </div>
          </template>
        </template>
        <template v-else>
          <p class="text-center text-gray-500">No messages yet.</p>
        </template>
      </div>

      <!-- Message Input -->
      <div class="bg-white p-4 shadow flex-none" v-if="activeFriend">
        <form @submit.prevent="submitForm">
          <textarea v-model="body" class="w-full p-2 bg-gray-100 rounded" placeholder="Type your message..."></textarea>
            <div class="text-right mt-2">
              <button type="submit" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 focus:outline-none focus:ring">
                Send
              </button>
            </div>
        </form>
      </div>
    </section>
    <section class="w-3/4 flex items-center justify-center" v-else>
      <p class="text-gray-500">Select a contact to view the conversation.</p>
    </section>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user'
import { io } from "socket.io-client";

export default {
    name: 'chat',
    setup() {
        const backend = import.meta.env.VITE_SERVER_URL;
        const socket = io(backend);

        const userStore = useUserStore();
        return {
            backend,
            socket,
            userStore
        }
    },
    data() {
        return {
            users: [],
            messages: [],
            conversation: -1,
            activeConversation: {},
            body: '',
            activeFriend: null
        }
    },

    mounted() {
        this.socket.on("connect", () => {
            console.log("socket connected");
        });

        this.socket.on("disconnect", (message) => {
            console.log("disconnected: ", message);
        });

        this.socket.on("getMessage", (message) => {
            this.messages.push(message);
        });
        this.getContacts();
    },
    
    methods: {
        getContacts() {
            const currentUserId = this.userStore.user.id;
            fetch(`${this.backend}/api/getConversation?id=${currentUserId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(friends => {

                this.users = friends.map((friend) => {
                    return {name: friend.other_user, url: "/头像.jpeg", id: friend.other_id, conversation_id: friend.conversation_id};
                });
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle errors
            });
            
        },
        getMessages(conversation_id) {
            const friend = this.users.find(user => user.conversation_id === conversation_id);
            if (friend) {
            this.activeFriend = friend;
            this.conversation = conversation_id
            fetch(`${this.backend}/api/getMessages?conversation_id=${conversation_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(messages => {
                this.messages = messages;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }},
        submitForm() {
            const conversation_id = this.conversation;
            if (this.conversation_id != -1) {
                const user_id = this.userStore.user.id;
                const now = new Date();
                const year = now.getFullYear();
                const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
                const day = now.getDate().toString().padStart(2, '0');
                const hours = now.getHours().toString().padStart(2, '0');
                const minutes = now.getMinutes().toString().padStart(2, '0');
                const seconds = now.getSeconds().toString().padStart(2, '0');
                const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                const message = {content: this.body, time: formattedTime, user_id: user_id};
                this.socket.emit("message", message);
                const data = {
                    message: message,
                    conversation_id: conversation_id,
                };
                fetch(`${this.backend}/api/addMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then(response => response.json())
                .then(data => console.log('Success'))
                .catch(error => console.error('Error:', error));
            }
        }}
}
</script>
