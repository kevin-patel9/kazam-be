const { createClient } = require("redis");
const client = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
});

client.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
    try {
        if (!client.isOpen) 
            await client.connect();
    } catch (err) {
        console.error("Failed to connect Redis:", err);
    }
})();

module.exports = client;
