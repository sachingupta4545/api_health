import { startMonitorChecker } from "./monitorChecker.job.js";
import { startMonitorWorker } from "./workers/monitorWorker.js";

// Register all cron jobs and workers here — called once after DB connects
export const startAllJobs = () => {
    startMonitorWorker();    // start worker first so it's ready before jobs are added
    startMonitorChecker();   // cron that adds jobs to the queue every minute
};
