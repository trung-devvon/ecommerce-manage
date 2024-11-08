import { Button } from "@/components/ui/button";
import { pathUser } from "@/path";
import { Link } from "react-router-dom";

const RoleSuccess = () => {
  return (
    <div className="flex-center flex-col h-screen gap-4">
      <h1 className="text-center text-2xl">
        Bạn đã đăng ký bán hàng thành công, hãy đăng nhập lại để tiếp tục nhé
      </h1>
      <Link to={`${pathUser.AUTH}/${pathUser.LOGIN}`}>
        <Button>Đến trang đăng nhập</Button>
      </Link>
    </div>
  );
};

export default RoleSuccess;
