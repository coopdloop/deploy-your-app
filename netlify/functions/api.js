// api.js

async (event) => {
  if (event.httpMethod === 'GET') {
    try {
      // Process the GET request as needed
      const data = require('./db.json');

      // Return the data as the response
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `${error}` }),
      };
    }
  }
};
