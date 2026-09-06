import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest, ApiResponse } from 'src/lib/api/requests';
import { createDropOffPointService, getDropOffPointByIdService, listDropOffPointsService } from 'src/services/locations/locations.service';
import { dropOffLocationKeys } from './keys';
import { DropOffPointPayload, GetLocationListParams, GetLocationParams } from 'src/types/location/location';
import { DropoffPointDto, DropoffPointsDto } from 'src/types/location/location.dto';
import { useAuth } from 'src/context/AuthContext';
import { toast } from 'sonner';


type DropoffPointQuery = {
  id?: string;
  params?: GetLocationListParams | GetLocationParams;
}
export const useDropoffPoints = ({id, params}: DropoffPointQuery) => {
    return useQuery<ApiResponse<DropoffPointDto | DropoffPointsDto> | null>({
        queryKey: id
            ? dropOffLocationKeys.detail(id)
            : dropOffLocationKeys.list(params),
        queryFn: () => 
            id
                ? getDropOffPointByIdService(id, params)
                : listDropOffPointsService(params)
    });
};



type CreateDropOffPointVariables = {
    payload: DropOffPointPayload
}

export function useCreateDropOffPoint() {
  const queryClient = useQueryClient();
  const { authUser } = useAuth();

  const mutation = useMutation({
    mutationFn: async ({
      payload,
    }: CreateDropOffPointVariables) => {
      if (authUser?.type === "COMPANYUSER") {
        return createDropOffPointService(payload)
      }
    },
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: dropOffLocationKeys.lists(),
      });
      toast.success(data?.message)
    }
  })

  return mutation
}

