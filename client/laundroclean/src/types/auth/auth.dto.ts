import { UserDto } from "../users/user.dto";

export type AuthResponseDto = {
    user: UserDto;
    profile?: unknown;
    accessToken: string;
};

export type LoginResponseDto = {
    accessToken: string;
    user: UserDto;
};

export type RefreshTokenResponseDto = {
    accessToken: string;
};