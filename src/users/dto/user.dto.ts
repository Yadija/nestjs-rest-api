import { IsNotEmpty, IsString, Length, NotContains } from 'class-validator';

export class UserDto {
  @NotContains(' ', {
    message: 'username contain forbiden character',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 50)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 100)
  fullname: string;
}
