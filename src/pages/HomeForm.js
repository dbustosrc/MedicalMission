import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth";

const HomeForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  return (
    <div>
      <h1>Mindo Futures</h1>
    </div>
  );
};

export default HomeForm;
