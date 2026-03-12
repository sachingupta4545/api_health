import { startMonitorChecker } from "./monitorChecker.job.js";

// Register all cron jobs here — called once after DB connects
export const startAllJobs = () => {
    startMonitorChecker();
    // add more jobs here as the project grows
};
