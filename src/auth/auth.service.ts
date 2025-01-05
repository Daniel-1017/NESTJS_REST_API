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

  async signin(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user does not exist throw exception
    if (!user)
      throw new ForbiddenException(`User with email ${dto.email} not found`);

    // compare password
    const pwMatches = await argon.verify(user.hash, dto.password);

    // if password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Password is incorrect');

    // send back the user
    delete user.hash;
    return user;
  }
}
