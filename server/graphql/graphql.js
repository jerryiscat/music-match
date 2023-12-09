const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLSchema
} = require('graphql')

const db = require('../postgreSQL/database');
const e = require('express');

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'This represents a author of a book',
  fields: () => ({
    user_id: { type: GraphQLInt },
    email: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    gender: { type: GraphQLString },
    age: { type: GraphQLInt },
    city: { type: GraphQLString },
    mbti: { type: GraphQLString },
    gpt_intro: { type: GraphQLString },
  })
})

const TopTrackType = new GraphQLObjectType({
  name: 'TopTrackType',
  description: 'This represents the toptrack  table',
  fields: () => ({
    music: {
      type: MusicType,
      resolve(parent, _) {
        return Music.findById(parent.music_id);
      },
    },
    user: {
      type: UserType,
      resolve(parent, _) {
        return User.findById(parent.user_id);
      },
    }
  })
})

const UserTopTracksType = new GraphQLObjectType({
  name: 'UserTopTracks',
  fields: {
    username: { type: GraphQLString },
    music_name: { type: GraphQLString }
  }
});

const MusicType = new GraphQLObjectType({
  name: 'Music',
  description: 'This represents a Music Type',
  fields: () => ({
    music_id: { type: GraphQLInt },
    music_name: { type: new GraphQLNonNull(GraphQLString) },
    artist: { type: new GraphQLNonNull(GraphQLString) },
    album_image: { type: new GraphQLNonNull(GraphQLString) },
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    allUsers: {
      type: GraphQLList(UserType),
      description: 'Get all users',
      resolve: async () => {
        try {
          const rows = await db.query('SELECT * FROM user_profile', []);
          return rows;
        } catch (error) {
          throw new Error('Error fetching users from the database.');
        }
      },
    },
    getUserByEmail: {
      type: GraphQLList(UserType),
      description: 'Check if contains user',
      args: {
        email: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        try {
          const email = args.email;
          console.log(email);      
          const rows = await db.query('SELECT user_id, email, username FROM user_profile WHERE email = $1', [email]);

          return rows;
        } catch (error) {
          throw new Error('Error fetching users from the database.');
        }
      },
    }
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addUser: {
      type: UserType,
      description: 'Add a user',
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        gender: { type: GraphQLString },
        age: { type: GraphQLInt },
        city: { type: GraphQLString },
        mbti: { type: GraphQLString },
        gpt_intro: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        try {
          const {
            email,
            username,
            gender,
            age,
            city,
            mbti,
            gpt_intro,
          } = args;
      
          const query = `
            INSERT INTO user_profile (email, username, gender, age, city, mbti, gpt_intro)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING user_id;`;
      
          const result = await db.query(query, [email, username, gender, age, city, mbti, gpt_intro]);
      
          return result[0];
        } catch(error) {
          console.error(error)
        }
      }
    },
    addMusic: {
      type: MusicType,
      description: 'Add a music',
      args: {
        music_name: { type: new GraphQLNonNull(GraphQLString) },
        artist: { type: new GraphQLNonNull(GraphQLString) },
        album_image: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, args) => {
        try {
          const {
            music_name,
            artist,
            album_image,
          } = args;
          console.log(music_name);
          const query = `
            INSERT INTO music (music_name, artist, album_image)
            VALUES ($1, $2, $3)
            ON CONFLICT (music_name) DO
              UPDATE SET music_name = EXCLUDED.music_name
            RETURNING music_id;
          `;
          


          const result = await db.query(query, [music_name, artist, album_image]);

          return result[0];
          
        } catch(error) {
          console.error(error)
        }
      }
    },
    addTopTrack: {
      type: TopTrackType,
      description: 'Add a TopTrack',
      args: {
        user_id: { type: new GraphQLNonNull(GraphQLInt) },
        music_id: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve: async (_, args) => {
        try {
          const {
            user_id,
            music_id,
          } = args;
          const query = `
            INSERT INTO top_track (user_id, music_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, music_id) DO NOTHING
            RETURNING *;`;
          const { rows } = await db.query(query, [user_id, music_id]);
          console.log("below are rows");
          console.log(rows);
          if (rows.length === 0) {
            throw new Error("TopTrack creation failed");
          }
          return rows[0];        
        } catch(error) {
          console.error(error)
        }
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

module.exports = {
  schema
};