export interface ChatPayload {
  prompt: string;
  temperature: number;
}

export interface ChatOptions {
  token: string;
  temperature: number;
}

export interface ChatService {
  generateAnswer(prompt: string, options: ChatOptions): Promise<string>;
}

export interface Timer {
  start(): void;
  stop(): number;
}
