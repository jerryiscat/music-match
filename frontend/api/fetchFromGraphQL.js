const graphqlEndpoint1 = "http://localhost:1000/graphql";
// const graphqlEndpoint2 = "https://music-match-back-end.onrender.com/graphql";
export const makeGraphQLPostRequest = async (mutation, variables) => {
    const response = await fetch(graphqlEndpoint1, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables,
      })});
    return response;
};

export const makeGraphQLGetRequest = async (query, variables) => {
    try {
        const response = await fetch(graphqlEndpoint1, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Include any additional headers as needed
          },
          body: JSON.stringify({
            query,
            variables,
          }),
        });
      
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
      } catch (error) {
        // Handle errors
        console.error(error);
      }
      
};