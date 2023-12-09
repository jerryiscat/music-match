# final-project-music-match
Project Proposal
Project Description:

App Description: use data from spotify to get personality tests and in the meanwhile find friends who have the same preference as you do, you can also chat with them on our web app.
Introducing our new app: MusicMatch!

Picture this: you're a music lover, a college student or a professional who is passionate about music and looking to expand your social circle. You've often wondered if there's a way to connect with others who share not only your taste in music, but also your interests and personality traits. That's where MusicMatch comes in.

MusicMatch also leverages Spotify data to offer a unique experience. By analyzing your music preferences, we provide personalized personality tests, offering insights into your individuality. But that's not all - we take it a step further.

MusicMatch isn't just about self-discovery; it's about forging connections. With our app, you can discover like-minded individuals who not only appreciate the same tunes but also share your interests and personality traits. Imagine the potential for meaningful friendships with people who truly resonate with you.

As developers, we're music enthusiasts ourselves, and we understand the power of music in bringing people together. We wanted to create a space for individuals like us, who value the bonds that form over shared playlists and favorite artists. With MusicMatch, we're not just building an app; we're creating a community for music lovers to connect, chat, and build lasting friendships.

So, if you're someone seeking to expand your social circle with people who understand the power of a perfectly curated playlist, look no further. Join us on MusicMatch and let the music be the bridge to new, meaningful connections. Get ready to embark on a journey of self-discovery and friendship, all through the universal language of music.


Technical Description
Include an architectural diagram mapping 1) all client, server, and database components, 2) flow of data, and its communication type (websockets? REST API?

![image](/frontend/public/diagram.png)

Communication Type: REST API
A summary table of user stories (descriptions of the experience a user would want) in a table like below.
For each user story, say who the user is, and what action or outcome the user wants.
For each of your user stories, describe in 1-3 sentences what your technical implementation strategy is. Explicitly note in bold which technology you are using (if applicable). 

![image](https://github.com/info441-wi23/final-project-jerryiscat/assets/91921275/5f252d22-1751-4076-833f-a89d5c70de2a)
![image](/frontend/public/userstory.png)

Additionally include:
Include a list of available endpoints your application will provide and what is the purpose it serves. Ex. GET /driver/{id}, POST "/driver/{id}/rating"
- POST/user/{id}/friendsList
  - get the friendList of a user
- POST/user/{id}/musicList             
  - get the music list that  a user listens to
- POST/user/{id}/personalityIntro    
  - generate the personality of the person using ChatGPT
- POST/user/{id}/profile  
  - get the profile of the user from their spotify account
- GET/user/{id}/
  - Get the single user with their id
- GET/auth/login
  - Login into the Spotify account
- GET/auth/logout
  -Login out the Spotify account
- GET/user/createProfile
  - Create the user’s profile
- GET/user/Match
  - Match the user with other people share similar music taste
- POST/user/{id}/friendsListMatched
  - Get the friends List that have matched together

Include any database schemas as an appendix

![image](https://github.com/info441-wi23/final-project-jerryiscat/assets/91921275/1b2ae60d-f1f6-4efa-8399-bbd4473bcc5b)

