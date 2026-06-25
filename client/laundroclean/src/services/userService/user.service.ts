import { profileApi } from "src/lib/api/profileApi";
import { mapUser } from "src/types/users/user.dto";
import { ChangePasswordPayload, UpdatedUser, UserProfilePayload, UserProfileResponse } from "src/types/users/user";

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

export async function changePasswordService(payload: ChangePasswordPayload) : Promise<UpdatedUser | null> {
    const res = await profileApi.changePassword(payload);
    if (!res.success || !res.data) {
        return null
    }

   return res.data
}