import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Request() req: AuthRequest) {
    console.log(req.user);

    return this.authService.login(req.user);
  }

  @Post('verify-token')
  @UseGuards(LocalAuthGuard) // Use o AuthGuard para proteger a rota
  async verifyToken(@Req() request: Request) {
    const token = request.headers.authorization.split(' ')[1]; // Pega o token do cabeçalho

    const decodedToken = await this.jwtService.validateToken(token);
    console.log(decodedToken.sub); // Aqui você tem o ID do usuário
    return decodedToken;
  }
}
