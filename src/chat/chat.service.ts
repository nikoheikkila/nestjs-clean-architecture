import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatOptions, ChatService } from '../contracts/chat.contract';

enum Model {
  OMNI = 'gpt-4o',
}

enum Role {
  SYSTEM = 'system',
  USER = 'user',
}

@Injectable()
export class OpenAIChatService implements ChatService {
  public async generateAnswer(
    prompt: string,
    options: ChatOptions,
  ): Promise<string> {
    const api = this.createClient(options.token);

    return this.generate(api, prompt, options);
  }

  private async generate(api: OpenAI, prompt: string, options: ChatOptions) {
    const completion = await api.chat.completions.create({
      model: Model.OMNI,
      temperature: options.temperature,
      messages: [
        {
          role: Role.USER,
          content: prompt,
        },
      ],
    });

    return completion.choices[0].message.content;
  }

  private createClient(token: string) {
    return new OpenAI({
      apiKey: token,
    });
  }
}
