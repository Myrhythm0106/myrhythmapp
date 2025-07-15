
import { InAppPurchasePage } from "@/components/empowerment/InAppPurchasePage";
import { useNavigate } from "react-router-dom";

const InAppPurchase = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return <InAppPurchasePage onBack={handleBack} />;
};

export default InAppPurchase;
