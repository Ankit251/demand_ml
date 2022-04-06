const { CloudTasksClient } = require("@google-cloud/tasks");
const {
  GCS_PROJECT,
  CLOUD_TASK_LOCATION,
  TASK_QUEUE,
} = require("../../config");
// Instantiates a client.
const client = new CloudTasksClient();

export async function addToDataUpdateQueue(payload) {
  let inSeconds;

  // Construct the fully qualified queue name.
  console.log("GCS_PROJECT - ", GCS_PROJECT);
  console.log("CLOUD_TASK_LOCATION - ", CLOUD_TASK_LOCATION);
  console.log("TASK_QUEUE - ", TASK_QUEUE);
  // const parent = client.queuePath("pod-appdev", "asia-south1", "test");
  const parent = client.queuePath(GCS_PROJECT, CLOUD_TASK_LOCATION, TASK_QUEUE);

  const task = {
    appEngineHttpRequest: {
      httpMethod: "POST",
      relativeUri: "/log_payload",
      appEngineRouting: {
        service: "data",
      },
    },
  };

  if (payload) {
    payload = JSON.stringify(payload);
    task.appEngineHttpRequest.body = Buffer.from(payload).toString("base64");
  }

  if (inSeconds) {
    task.scheduleTime = {
      seconds: inSeconds + Date.now() / 1000,
    };
  }

  const request = {
    parent: parent,
    task: task,
  };

  // Send create task request.
  return client.createTask(request);
}
