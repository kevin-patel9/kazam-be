const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require("dotenv").config({ path: "./config/config.env" });
const { connectDB } = require("./config/database");
const client = require('./utils/redisConnection');
const v4 = require("uuid4");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

const REDIS_OBJ_KEY = 'FULLSTACK_TASK_KEVIN';

connectDB();

const TaskModel = require('./models/taskModel');

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('add', async (task) => {
        if (!task) return;

        // Add task to Redis
        await client.rPush(REDIS_OBJ_KEY, JSON.stringify({ taskName: task.trim(), storeage: "redis" }));

        // Check Redis length
        const taskCount = await client.lLen(REDIS_OBJ_KEY);

        if (taskCount > 10) {
            const tasks = await client.lRange(REDIS_OBJ_KEY, 0, -1);
            const parsedTasks = tasks.map(data => ({
                taskId: v4(),
                taskName: JSON.parse(data).taskName
            }));

            await TaskModel.insertMany(parsedTasks);

        // Clear Redis
            await client.del(REDIS_OBJ_KEY);
        }
    });
});

const taskRoute = require("./routes/taskRoute");

app.use("/api/v1", taskRoute);

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
