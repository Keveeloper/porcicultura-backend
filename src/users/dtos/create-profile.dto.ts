  import { IsNotEmpty, IsOptional, IsString } from "class-validator";

  export class CreateProfileDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsOptional()
    avatar?: string;
  }
