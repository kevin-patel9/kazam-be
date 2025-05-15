const TaskModel = require("../models/taskModel");
const redisKey = process.env.REDIS_TASK_KEY || "FULLSTACK_TASK_KEVIN";
const client = require('../utils/redisConnection');


exports.fetchAllTasks = async (req, res) => {
    try {
        const dbArrayTasks = await TaskModel.find();
        const redisArrayTasks = await client.lRange(redisKey, 0, -1);

        // added storage to identify where data is stored
        const redisTasksFormatted = redisArrayTasks.map(data => JSON.parse(data));

        const allTaskList = [...dbArrayTasks, ...redisTasksFormatted];

        res.status(200).send({ success: true, allTaskList: allTaskList.reverse() });
    } catch (error) {
        console.error("Error in fetchAllTasks:", error);
        return res.status(500).send({ success: false, message: "Internal server error" });
    }
};
