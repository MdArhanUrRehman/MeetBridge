import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const withAuth = (WrappedComponent) => {
  const authComponent = (props) => {
    const router = useNavigate();

    const isAuthenticated = () => {
      if (localStorage.getItem("token")) {
        return true;
      } else {
        toast("Login to stay connected", {
          icon: "⌛",
        });
        return false;
      }
    };

    useEffect(() => {
      if (!isAuthenticated()) {
        router("/auth");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return authComponent;
};

export default withAuth;
