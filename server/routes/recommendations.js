const express = require('express');
const router = express.Router();
const db = require('../postgreSQL/database');

async function findUsersWithSimilarMusicTaste(userId) {
    try {
        // Fetch all users' top tracks
        const allUsersTopTracksResult = await db.query(`
            SELECT DISTINCT user_profile.user_id, user_profile.username, music.music_name 
            FROM user_profile
            JOIN top_track ON top_track.user_id = user_profile.user_id
            JOIN music ON top_track.music_id = music.music_id;
        `);
        const allUsersTopTracks = allUsersTopTracksResult;

        const currentUserTopTracksResult = await db.query(`
            SELECT DISTINCT music_name 
            FROM top_track 
            JOIN user_profile ON top_track.user_id = user_profile.user_id
            JOIN music ON top_track.music_id = music.music_id
            WHERE user_profile.user_id = $1;
        `, [userId]);
        const currentUserTopTracks = currentUserTopTracksResult.map(row => row.music_name);

        let userMatches = [];
        allUsersTopTracks.forEach(track => {
            if (track.user_id !== userId) {
                const theirTracks = allUsersTopTracks
                    .filter(t => t.user_id === track.user_id)
                    .map(t => t.music_name);
                const sharedTracksCount = currentUserTopTracks.filter(t => theirTracks.includes(t)).length;
                if (sharedTracksCount >= 0) {
                    const isAlreadyAdded = userMatches.some(match => match.user_id === track.user_id);
                    if (!isAlreadyAdded) {
                        userMatches.push({ user_id: track.user_id, username: track.username, sharedTracksCount });
                    }
                } 
            }
        });

        // Sort by shared track count and return top 5 matches
        userMatches.sort((a, b) => b.sharedTracksCount - a.sharedTracksCount);
        console.log('userMatches', userMatches.slice(0, 5));
        return userMatches.slice(0, 5);
    } catch (error) {
        console.error('Error in findUsersWithSimilarMusicTaste:', error);
        throw error;
    }
}

router.get('/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        if (isNaN(userId)) {
            return res.status(400).send('User ID must be a number');
        }
        const recommendedUsers = await findUsersWithSimilarMusicTaste(userId);
        res.json(recommendedUsers);
    } catch (error) {
        console.error('Error in getting recommendations:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
