import { MessageResponse } from "@/interfaces/message";
import instance from "./instance";
import { FieldValues, SubmitHandler } from "react-hook-form";

export const updateRoleAPI = async (
  data: FieldValues
): Promise<MessageResponse> => {
  const response = await instance({
    method: "POST",
    url: "/shop/update-role",
    data,
  });
  return response.data;
};
