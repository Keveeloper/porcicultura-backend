import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, isString, IsString, MinLength, ValidateNested } from "class-validator";
import { CreateProfileDto } from "./create-profile.dto";

export class CreateUserDto {

  @IsString()
  @IsOptional()
  uid: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ValidateNested()
  @Type(() => CreateProfileDto)
  @IsNotEmpty()
  profile: CreateProfileDto;
}
