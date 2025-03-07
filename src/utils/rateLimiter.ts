class RateLimiter {
  private requests = 0;
  private lastReset = new Date();
  private readonly maxRequests = 9500; // Buffer of 500 from 10k limit
  private readonly resetInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  public async checkLimit(): Promise<boolean> {
    const now = new Date();
    if (now.getTime() - this.lastReset.getTime() >= this.resetInterval) {
      this.requests = 0;
      this.lastReset = now;
    }

    if (this.requests >= this.maxRequests) {
      return false;
    }

    this.requests++;
    return true;
  }
}

// Singleton instance
export const youtubeRateLimiter = new RateLimiter();
