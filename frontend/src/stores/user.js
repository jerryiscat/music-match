import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore({
    id: 'user',

    state: () => ({
        user: {
            isAuthenticated: false,
            id: null,
            name: null,
            mbti: null,
            age: null,
            email: null,
            access: null,
            refresh: null,
            avatar: null,
            genres: null,
            songs: null
        }
    }),

    actions: {
        initStore() {
            console.log('initStore', localStorage.getItem('user.access'))

            if (localStorage.getItem('user.isAuthenticated')) {
                this.user.access = localStorage.getItem('user.access');
                this.user.refresh = localStorage.getItem('user.refresh');
                this.user.id = localStorage.getItem('user.id');
                this.user.name = localStorage.getItem('user.name');
                this.user.mbti = localStorage.getItem('user.mbti');
                this.user.age = localStorage.getItem('user.age');
                this.user.email = localStorage.getItem('user.email');
                this.user.avatar = localStorage.getItem('user.avatar');
                const user_genres = localStorage.getItem('user.genres');
                this.user.genres = JSON.parse(user_genres);
                this.user.isAuthenticated = true
                const songs = localStorage.getItem('songs');
                this.user.songs = JSON.parse(songs);
                this.refreshToken()

                console.log('Initialized user:', this.user)
            }
        },

        setToken(data) {

            this.user.access = data.access
            this.user.refresh = data.refresh
            this.user.isAuthenticated = true

            localStorage.setItem('user.access', data.access)
            localStorage.setItem('user.refresh', data.refresh)

            console.log('user.access: ', localStorage.getItem('user.access'))
        },

        setSongs(songs) {
            this.user.songs = songs;
            localStorage.setItem('songs', JSON.stringify(songs));
        },
        removeToken() {
            console.log('removeToken')

            this.user.refresh = null
            this.user.access = null
            this.user.isAuthenticated = false
            this.user.id = null
            this.user.name = null
            this.user.age = null
            this.user.mbti = null
            this.user.email = null
            this.user.avatar = null
            this.user.genres= null
            this.user.songs = null

            localStorage.setItem('user.access', '')
            localStorage.setItem('user.refresh', '')
            localStorage.setItem('user.id', '')
            localStorage.setItem('user.name', '')
            localStorage.setItem('user.mbti', '')
            localStorage.setItem('user.age', null)
            localStorage.setItem('user.email', '')
            localStorage.setItem('user.avatar', '')
            localStorage.setItem('user.genres', [])
            localStorage.setItem('songs', [])
        },

        setUserInfo(user) {
            console.log('setUserInfo', user)

            this.user.id = user.id
            this.user.name = user.name
            this.user.mbti= user.mbti
            this.user.age = user.age
            this.user.email = user.email
            this.user.avatar = user.avatar
            this.user.genres = user.genres
            this.user.isAuthenticated = true

            localStorage.setItem('user.id', this.user.id)
            localStorage.setItem('user.name', this.user.name)
            localStorage.setItem('user.mbti', this.user.mbti)
            localStorage.setItem('user.age', this.user.age)
            localStorage.setItem('user.email', this.user.email)
            localStorage.setItem('user.avatar', this.user.avatar)
            localStorage.setItem('user.genres', JSON.stringify(this.user.genres));
            localStorage.setItem('user.isAuthenticated', this.user.isAuthenticated)


            console.log('User', this.user)
        },

        refreshToken() {
            const user_id = localStorage.getItem('user.id', this.user.id)
            const user_name = localStorage.getItem('user.name', this.user.name)
            const user_mbti = localStorage.getItem('user.mbti', this.user.mbti)
            const user_age = localStorage.getItem('user.age', this.user.age)
            const user_email = localStorage.getItem('user.email', this.user.email)
            const user_avatar = localStorage.getItem('user.avatar', this.user.avatar)
            const user_genres = localStorage.getItem('user.genres', this.user.genres)
            const genres = JSON.parse(user_genres);
            const songs = localStorage.getItem('songs', this.user.songs)
            const user_songs = JSON.parse(songs);
            const auth = localStorage.getItem('user.isAuthenticated', this.user.isAuthenticated)
            this.user.id = user_id
            this.user.name = user_name
            this.user.mbti= user_mbti
            this.user.age = user_age
            this.user.email = user_email
            this.user.avatar = user_avatar
            this.user.genres = genres
            this.user.songs = user_songs
            this.user.isAuthenticated = auth
        },
    }
})