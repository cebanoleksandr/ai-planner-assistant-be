import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageDto } from './dto/message.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async handleMessage(
    @Body() messageDto: MessageDto,
    @GetUser() user: any,
    @Req() req: any,
  ) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    return this.chatService.sendMessage(messageDto.message, user, token);
  }
}
