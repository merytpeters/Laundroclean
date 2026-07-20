import { profileApi } from "src/lib/api/profileApi";
import { mapUser } from "src/types/users/user.dto";
import { ChangePasswordPayload, UpdatedUserResponse, UserProfilePayload, UserProfileResponse, ProfileResponse, GetUsersParams, UpdateUserStatusPayload } from "src/types/users/user";
import { adminApi } from "src/lib/api/adminApi";

export async function getCurrentUserProfileService(): Promise<UserProfileResponse | null> {
    const res = await profileApi.getCurrentUserProfile();

    if (!res.success || !res.data) {
        return null
    }

    const {user, ...profile} = res.data;

    return {
        user: mapUser(user),
        profile: profile
    }
}

export async function updateProfileService(payload: UserProfilePayload): Promise<UserProfileResponse | null> {
    const res = await profileApi.updateProfile(payload);

    if (!res.success || !res.data) {
        return null
    }

    const {user, ...profile} = res.data;

    return {
        user: mapUser(user),
        profile: profile
    }
}

export async function changePasswordService(payload: ChangePasswordPayload) : Promise<UpdatedUserResponse | null> {
    const res = await profileApi.changePassword(payload);
    if (!res.success || !res.data) {
        return null
    }

   return res.data
}

export async function softDeleteAccountService(): Promise<string | null> {
    const res = await profileApi.softDeleteAccount();

    if (!res.success) {
        return null
    }

    return res.message || "Account Deactivated Successfully"
}

export async function updateProfilePicService(imageFile: File): Promise<ProfileResponse | null> {
    const formData = new FormData()
    formData.append("avatar", imageFile)

    const res = await profileApi.updateProfilePic(formData);

    if (!res.success || !res.data) {
        return null
    }

    return res.data
}

export async function deleteProfilePicService(): Promise<ProfileResponse | null> {
    const res = await profileApi.deleteProfilePic();

    if (!res.success || !res.data) {
        return null
    }

    return res.data
}

export async function adminGetUserService(userId: string): Promise<UserProfileResponse | null> {
    const res = await adminApi.getUser(userId);

    if (!res.success || !res.data) {
        return null
    }

    const {user, ...profile} = res.data;

    return {
        user: mapUser(user),
        profile: profile
    }
}

export async function adminGetUsersService(params?: GetUsersParams): Promise<UserProfileResponse[] | null> {
    const res = await adminApi.getUsers(params);

    if (!res.success || !res.data) {
        return null
    }

    const users = res.data.map((singleuser) => {
        const {user, ...profile} = singleuser;

        return {
            user: mapUser(user),
            profile: profile
        }
    })

    return users;
}

export async function adminUpdateUserStatus(userId: string, payload: UpdateUserStatusPayload): Promise<UpdatedUserResponse | null> {
    const res = await adminApi.updateUserStatus(userId, payload);

    if (!res.success || !res.data) {
        return null
    }

    return res.data
}