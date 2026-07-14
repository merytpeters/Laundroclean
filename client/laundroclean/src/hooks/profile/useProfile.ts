import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUserProfileService, updateProfilePicService, updateProfileService, changePasswordService, softDeleteAccountService, deleteProfilePicService } from "src/services/userService/user.service";
import { profileKeys } from "./keys";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useCurrentUser() {
    return useQuery({
        queryKey: profileKeys.profile(),
        queryFn: getCurrentUserProfileService,
    })
}

export function useUpdateProfilePic() {
    const queryClient = useQueryClient();

    return useMutation ({
        mutationFn: updateProfilePicService,

        onSuccess() {
            queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
            toast.success("Profile picture updated successfully")
        },

        onError(error) {
            toast.error(error.message);
        }
    })
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation ({
        mutationFn: updateProfileService,

        onSuccess() {
            queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
            toast.success("Profile updated successfully")
        },

        onError(error) {
            toast.error(error.message);
        }
    })
}

export function useDeleteProfilePic() {
    const queryClient = useQueryClient();

    return useMutation ({
        mutationFn: deleteProfilePicService,

        onSuccess() {
            queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
            toast.success("Profile picture deleted successfully")
        },

        onError(error) {
            toast.error(error.message);
        }
    })
}

export function useSoftDeleteAccount() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation ({
        mutationFn: softDeleteAccountService,

        onSuccess() {
            queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
            toast.success("Account Successfully Delete")
            router.push("/signup")
        },

        onError(error) {
            toast.error(error.message);
        }
    })
}

export function useChangePassword() {
    const queryClient = useQueryClient();

    return useMutation ({
        mutationFn: changePasswordService,

        onSuccess() {
            queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
            toast.success("Password updated Successfully")
        },

        onError(error) {
            toast.error(error.message);
        }
    })
}