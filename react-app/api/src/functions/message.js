process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Disable TLS certificate validation for local emulator

const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

// Initialize Cosmos DB client
const endpoint = 'https://127.0.0.1:8081'; // Cosmos DB Emulator endpoint
const key =
  'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=='; // Cosmos DB Emulator key
const client = new CosmosClient({ endpoint, key });
const databaseId = 'TestDB';
const containerId = 'Items';

app.http('message', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    return { body: `Hello, from the API!` };
  },
});

app.http('messageJson', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const jsonData = {
      id: 1,
      type: 'notification',
      message: 'Hello from JSON API!',
    };

    return {
      jsonBody: jsonData,
    };
  },
});

app.http('healthCheck', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const currentDate = new Date().toLocaleString();
    return {
      jsonBody: {
        text: `API is healthy! Current date and time: ${currentDate}`,
      },
    };
  },
});

app.http('fetchFromDb', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const container = client.database(databaseId).container(containerId);
      const { resources } = await container.items
        .query("SELECT * FROM c WHERE c.id = '1'")
        .fetchAll();

      if (resources.length > 0) {
        return {
          jsonBody: { value: resources[0].value },
        };
      } else {
        return {
          jsonBody: { error: 'No item found with the specified ID' },
        };
      }
    } catch (error) {
      context.log(`Error querying Cosmos DB: ${error.message}`);
      return {
        status: 500,
        jsonBody: { error: 'Failed to fetch data from Cosmos DB' },
      };
    }
  },
});
