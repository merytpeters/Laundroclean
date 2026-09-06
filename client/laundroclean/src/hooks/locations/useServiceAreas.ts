import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, ApiResponse } from 'src/lib/api/requests';
// import { mockServiceAreas } from 'src/services/locations/mock';
import {
  createServiceAreaService,
  listServiceAreasService,
  getServiceAreaByIdService,
  updateServiceAreaByIdService,
  deactivateServiceAreaByIdService,
  activateServiceAreaByIdService
} from 'src/services/locations/locations.service';
import { GetLocationListParams, GetLocationParams, ServiceAreaPayload, ServiceAreaResponse, ServiceAreasResponse } from 'src/types/location/location';
import { useAuth } from "src/context/AuthContext";
import { ServiceAreaDto, ServiceAreasDto } from "src/types/location/location.dto";
import { serviceAreaKeys } from "./keys";
import { toast } from "sonner";


type CreateServiceAreaVariables = {
  payload: ServiceAreaPayload;
}

export function useCreateServiceArea() {
  const queryClient = useQueryClient();
  const { authUser } = useAuth();

  const mutation = useMutation({
    mutationFn: async ({
      payload,
    }: CreateServiceAreaVariables) => {
      if (authUser?.type === "COMPANYUSER") {
        return createServiceAreaService(payload)
      }
    },
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: serviceAreaKeys.lists(),
      });
      toast.success(data?.message)
    }
  })

  return mutation
}


type ServiceAreaQuery = {
  id?: string;
  params?: GetLocationListParams | GetLocationParams;
}

export function useServiceAreas({ id, params }: ServiceAreaQuery) {
  return useQuery<ApiResponse<ServiceAreaDto | ServiceAreasDto> | null>({
    queryKey: id
      ? serviceAreaKeys.detail(id)
      : serviceAreaKeys.list(params),
    queryFn: () =>
      id
        ? getServiceAreaByIdService(id, params)
        : listServiceAreasService(params)
  });
};

