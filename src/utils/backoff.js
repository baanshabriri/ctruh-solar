export function getBackoffDelay(retries) {
    const baseDelay = 1000;
    const maxDelay = 30000;

    const delay = Math.min(
        baseDelay * Math.pow(2, retries),
        maxDelay
    );
    // add jitter
    const jitter = Math.random() * 500;
    return delay + jitter;
}