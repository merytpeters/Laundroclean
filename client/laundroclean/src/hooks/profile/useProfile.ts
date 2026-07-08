import { useQuery } from "@tanstack/react-query";
import { getCurrentUserProfileService, updateProfilePicService, updateProfileService, changePasswordService, softDeleteAccountService, deleteProfilePicService } from "src/services/userService/user.service";
import { profileKeys } from "./keys";

export function useCurrentUser() {
    return useQuery({
        queryKey: profileKeys.profile(),
        queryFn: getCurrentUserProfileService,
    })
}