import { Injectable } from '@nestjs/common';
import { ChatOptions, ChatService } from './interfaces';
import OpenAI from 'openai';

@Injectable()
export class OpenAIChatService implements ChatService {
  public async generateAnswer(
    prompt: string,
    options: ChatOptions,
  ): Promise<string> {
    const api = new OpenAI({
      apiKey: options.token,
    });

    const completion = await api.chat.completions.create({
      model: "gpt-4o",
      temperature: options.temperature,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return completion.choices[0].message.content;
  }
}
