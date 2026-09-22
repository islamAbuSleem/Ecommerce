import { IsEmail, IsIn, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail() email: string;
  @IsString() @MinLength(8) @MaxLength(72) password: string;
  @IsString() @IsNotEmpty() fullName: string;
  @IsIn(['buyer', 'seller']) role: 'buyer' | 'seller';
}
