import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateProfessionalDto {

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    last_name: string;
}
