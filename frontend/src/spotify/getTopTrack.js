// Because this is a literal single page application
// we detect a callback from Spotify by checking for the hash fragment
import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce";
import { useUserStore } from "../stores/user"
import { makeGraphQLPostRequest, makeGraphQLGetRequest } from "../../api/fetchFromGraphQL";

export async function login() {
  const clientId = "f21c0af506124befba30b0c73dccc1f4";
  redirectToAuthCodeFlow(clientId);
}

export async function getTopSongs(code) {
  const clientId = "f21c0af506124befba30b0c73dccc1f4";
  console.log("this is code from search");
  console.log(code);
  const userStore = useUserStore();

  const accessToken = await getAccessToken(clientId, code);
  console.log("Access code:");
  console.log(accessToken);

  const profiles = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` }
  });

  const result = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=5", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` }
  });

  const artistsResult = await fetch('https://api.spotify.com/v1/me/top/artists?limit=5', {
            method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
        });

        const artists = await artistsResult.json();
        const songs = await result.json();
        const user = await profiles.json();
        const data = await doesUserExist(user.email);

        const genreWordCounts = {};
        artists.items.forEach(artist => {
          artist.genres.forEach(genre => {
            genre.split(" ").forEach(word => {
              if (word in genreWordCounts) {
                genreWordCounts[word]++;
              } else {
                genreWordCounts[word] = 1;
              }
            });
          });
        });

        const sortedGenres = Object.entries(genreWordCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(item => item[0]);

  console.log(sortedGenres);
  console.log("Top songs:");
  console.log(songs);
  let current_id;

  if (data.length === 0) {
      const response = await makeGraphQLPostRequest(addUserMutation, { email: user.email, username: user.display_name });
      const user_id = await response.json();
      current_id = user_id.data.addUser.user_id;
  } else {
      current_id = data[0].user_id;
  }

  const profile = {
    id: current_id,
    name: user.display_name,
    age: null,
    email: user.email,
    avatar: (user.images[0]) ? user.images[0].url : "头像.jpeg",
    genres: sortedGenres,
  }
  userStore.setUserInfo(profile);

  const toptracks = songs.items.map((track) => {
      const albumImage = track.album.images[0].url;
      const artistName = track.artists[0].name;
      const musicName = track.name;

      return { "albumImage": albumImage, "musicName": musicName, "artistName": artistName };
  });

  let music_ids = [];

  await Promise.all(toptracks.map(async (topTrack) => {
      const { musicName, artistName, albumImage } = topTrack;

      const variables = {
          music_name: musicName,
          artist: artistName,
          album_image: albumImage,
      };

      const response = await makeGraphQLPostRequest(addMusicMutation, variables);
      const result = await response.json();

      music_ids.push(result.data.addMusic.music_id);
  }));

  await Promise.all(music_ids.map(async (music) => {
      const variables = {
          music_id: music,
          user_id: current_id
      };

      const response = await makeGraphQLPostRequest(addTopTrackMutation, variables);
      const result = await response.json();
  }));
  return songs.items;
}

const addTopTrackMutation = 
  `mutation AddTopTrack($user_id: Int!, $music_id: Int!) {
    addTopTrack(user_id: $user_id, music_id: $music_id) {
        music {
            music_id
            music_name
            artist
            album_image
          }
          user {
            user_id
            email
            username
            gender
            age
            city
            mbti
            gpt_intro
          }
    }
  }
  `
const addMusicMutation = `
  mutation AddMusic($music_name: String!, $artist: String!, $album_image: String!) {
    addMusic(music_name: $music_name, artist: $artist, album_image: $album_image) {
      music_id
    }
  }
`;

const addUserMutation = `
  mutation AddUser($email: String!, $username: String!, $gender: String, $age: Int, $city: String, $mbti: String, $gpt_intro: String) {
    addUser(email: $email, username: $username, gender: $gender, age: $age, city: $city, mbti: $mbti, gpt_intro: $gpt_intro) {
      user_id
    }
  }
`;

const doesUserExist = async (email_address) => {
    const query = `
        query GetUserByEmail($email: String!) {
            getUserByEmail(email: $email) {
                user_id
            }
        }
    `;
    console.log("email here:");
    console.log(email_address);
    const variables = { email: email_address }; 
    const response = await makeGraphQLGetRequest(query, variables);
    const { data } = response;
    return data.getUserByEmail; // Return true if the array is not empty, indicating the user exists
};