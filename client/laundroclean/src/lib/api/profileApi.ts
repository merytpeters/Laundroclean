import { apiRequest } from "./requests";
import { UserProfileDto, UserDto, ProfileDto } from "src/types/users/user.dto";
import { ChangePasswordPayload, UserProfilePayload } from "src/types/users/user";

export const profileApi = {
    getCurrentUserProfile: () =>
        apiRequest<UserProfileDto>("/profile", {
            credentials: "include",
        }),

    updateProfile: (payload: UserProfilePayload) =>
        apiRequest<UserProfileDto>("/profile", {
            method: "PATCH",
            body: JSON.stringify(payload)
        }),

    changePassword: (payload: ChangePasswordPayload) =>
        apiRequest<UserDto>("/profile/change-password", {
            method: "PATCH",
            body: JSON.stringify(payload)
        }),

    softDeleteAccount: () =>
        apiRequest<string>("/profile/soft-delete", {
            method: "PATCH",
        }),
    
    updateProfilePic: (payload: FormData) =>
        apiRequest<ProfileDto>("/profile/pic", {
            method: "PATCH",
            body: payload,
        }),

    deleteProfilePic: () =>
        apiRequest<ProfileDto>("/profile/pic", {
            method: "DELETE"
        })
}