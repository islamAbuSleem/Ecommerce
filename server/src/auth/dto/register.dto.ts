import { IsEmail, IsString, Length, IsIn } from 'class-validator';

export class RegisterDto {
  @IsEmail() email: string;
  @IsString() @Length(6) password: string;
  @IsString() fullName: string;
  @IsIn(['buyer', 'seller']) role: 'buyer' | 'seller';
}
