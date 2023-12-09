const backend = import.meta.env.VITE_SERVER_URL;

export async function redirectToAuthCodeFlow(clientId) {
    const params = new URLSearchParams();

    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);
    // const front_local = "http://localhost:5173/feed";
    // params.append("redirect_uri", front_local);

    const front_web ="https://final-project-music-match.azurewebsites.net/feed"
    params.append("redirect_uri", front_web);

    localStorage.setItem("verifier", verifier);

    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("scope", "user-read-private user-read-email user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(clientId, code) {
    const params = new URLSearchParams();
    // const front_local = "http://localhost:5173/feed";
    // params.append("redirect_uri", front_local);

    const front_web ="https://final-project-music-match.azurewebsites.net/feed"
    params.append("redirect_uri", front_web);

    const verifier = localStorage.getItem("verifier");
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("code_verifier", verifier);

    console.log("this is the param");
    console.log(clientId);
    console.log(code);
    console.log(verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
