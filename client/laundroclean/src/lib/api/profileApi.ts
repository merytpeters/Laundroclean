import { apiRequest } from "./requests";
import { UserProfileDto, UserDto } from "src/types/users/user.dto";
import { ChangePasswordPayload, UserProfilePayload } from "src/types/users/user";

export const profileApi = {
    getCurrentUserProfile: () =>
        apiRequest<UserProfileDto>("/profile"),

    updateProfile: (payload: UserProfilePayload) =>
        apiRequest<UserProfileDto>("/profile", {
            method: "PATCH",
            body: JSON.stringify(payload)
        }),

    changePassword: (payload: ChangePasswordPayload) =>
        apiRequest<UserDto>("/profile/change-password", {
            method: "PATCH",
            body: JSON.stringify(payload)
        })
}