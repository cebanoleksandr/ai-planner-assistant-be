import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async sendMessage(message: string, user: any): Promise<any> {
    const n8nWebhookUrl = this.configService.get<string>('N8N_WEBHOOK_URL');

    try {
      const response = await firstValueFrom(
        this.httpService.post(n8nWebhookUrl, {
          message,
          userId: user.userId,
          email: user.email,
          timestamp: new Date().toISOString(),
        }),
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при запросе к n8n:', error.message);
      throw new InternalServerErrorException(
        'Не удалось получить ответ от ассистента',
      );
    }
  }
}
