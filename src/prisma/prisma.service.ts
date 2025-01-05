import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'mongodb+srv://frimudaniel:1234@cluster0.bhqi5.mongodb.net/nestjs',
        },
      },
    });
  }
}
