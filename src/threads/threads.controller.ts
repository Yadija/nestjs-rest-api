import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { AccessTokenGuard } from '../common/guards';
import { GetCurrentUsername } from '../common/decorators';
import { ThreadDto } from './dto/thread.dto';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createThread(
    @GetCurrentUsername() username: string,
    @Body() thread: ThreadDto,
  ) {
    const { id } = await this.threadsService.addthread(
      thread.content,
      username,
    );

    return {
      status: 'success',
      data: {
        threadId: id,
      },
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getThreads() {
    const threads = await this.threadsService.getAllThreads();

    return {
      status: 'success',
      data: {
        threads,
      },
    };
  }

  @Get(':threadId')
  @HttpCode(HttpStatus.OK)
  async getThreadById(@Param('threadId') id: string) {
    const thread = await this.threadsService.getThreadById(id);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }

  @UseGuards(AccessTokenGuard)
  @Put(':threadId')
  @HttpCode(HttpStatus.OK)
  async updateThread(
    @GetCurrentUsername() username: string,
    @Body() thread: ThreadDto,
    @Param('threadId') id: string,
  ) {
    const { owner } = await this.threadsService.checkThreadIsExist(id);
    await this.threadsService.verifyThreadOwner(owner, username);
    await this.threadsService.editThreadById(id, thread.content);

    return {
      status: 'success',
      message: 'thread updated successfully',
    };
  }
}
