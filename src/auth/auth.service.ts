import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const PRISMA_DUPLICATE_FIELD_CODE = 'P2002';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // generate the password
    const hash = await argon.hash(dto.password);

    try {
      // save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      // return the saved user
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PRISMA_DUPLICATE_FIELD_CODE
      ) {
        throw new ForbiddenException('Credentials taken');
      }

      throw error;
    }
  }

  signin() {
    return 'I am signin';
  }
}
