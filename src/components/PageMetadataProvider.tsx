import { useLocation } from "react-router-dom";
import { usePageMetadata } from "@/hooks/usePageMetadata";

const PageMetadataProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  usePageMetadata(location.pathname);
  return <>{children}</>;
};

export default PageMetadataProvider;
