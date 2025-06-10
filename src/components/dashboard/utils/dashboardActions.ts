
import { toast } from "sonner";

export const handleRefreshDashboard = async () => {
  // Simulate refresh
  await new Promise(resolve => setTimeout(resolve, 1000));
  toast.success("Dashboard refreshed! ✨", { duration: 2000 });
};

export const handleShareDashboard = () => {
  toast.success("Dashboard sharing options opened", { duration: 2000 });
};
