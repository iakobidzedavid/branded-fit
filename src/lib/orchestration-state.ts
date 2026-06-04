// In-memory state store for orchestration progress
// In production, this would use Redis or a database

type PipelineStatus = "pending" | "in_progress" | "completed" | "failed";

export interface OrchestrationState {
  status: "pending" | "in_progress" | "completed" | "failed";
  pipeline1: { status: PipelineStatus; message: string };
  pipeline2: { status: PipelineStatus; message: string };
  pipeline3: { status: PipelineStatus; message: string };
  storefront?: { url: string; productCount: number };
  brandData?: {
    colors: { hex: string; type?: string }[];
    logoUrl?: string;
    fontFamily?: string;
    confidence: number;
  };
  error?: string;
  startTime?: number;
  timestamp: number;
}

class OrchestrationStore {
  private states = new Map<string, OrchestrationState>();
  private cleanupInterval = 3600000; // 1 hour

  constructor() {
    // Clean up old states periodically
    setInterval(() => {
      const now = Date.now();
      for (const [domain, state] of this.states.entries()) {
        if (now - state.timestamp > this.cleanupInterval) {
          this.states.delete(domain);
        }
      }
    }, this.cleanupInterval);
  }

  set(domain: string, state: OrchestrationState): void {
    this.states.set(domain.toLowerCase(), { ...state, timestamp: Date.now() });
  }

  get(domain: string): OrchestrationState | undefined {
    return this.states.get(domain.toLowerCase());
  }

  has(domain: string): boolean {
    return this.states.has(domain.toLowerCase());
  }

  delete(domain: string): void {
    this.states.delete(domain.toLowerCase());
  }

  clear(): void {
    this.states.clear();
  }
}

export const orchestrationStore = new OrchestrationStore();
