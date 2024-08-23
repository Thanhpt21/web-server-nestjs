import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from '@/decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';



@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, 
    private readonly mailerService: MailerService
  ) {}

  @Post("login")
  @Public()
  @UseGuards(LocalAuthGuard)
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post("register")
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.register(registerDto)
  }

  @Get("mail")
  @Public()
  testMail() {
    this.mailerService.sendMail({
      to: 'thanhpt21.it@gmail.com', // list of receivers
     
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcome', // plaintext body
      html: '<b>Xin chào với devdown</b>', // HTML body content
    })
    return "ok"
  }


}
