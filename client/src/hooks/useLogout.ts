import { logoutAPI } from "@/api/auth";
import { useAppDispatch } from "./useApp";
import { toast } from "sonner";
import { logout } from "@/redux/slices/user.slice";

const useLogout = () => {
  const dispatch = useAppDispatch();
  return async () => {
    const refreshToken: string | null = localStorage.getItem("refreshToken");
    try {
      const response = await logoutAPI({ refreshToken });
      if (response.status === 204) {
        // toast.success("Bạn đã đăng xuất");
        dispatch(logout());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } catch (error) {
      toast("Opps! có lỗi xảy ra");
    }
  };
};
export default useLogout
