import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ThreadDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  content: string;
}
