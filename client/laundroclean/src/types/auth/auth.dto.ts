import { UserDto } from "../users/user.dto";

export type AuthResponseDto = {
    user: UserDto;
    profile?: unknown;
    accessToken: string;
    refreshToken: string;
};

export type LoginResponseDto = {
    accessToken: string;
    authenticatedUser: UserDto;
    refreshToken: string;
};