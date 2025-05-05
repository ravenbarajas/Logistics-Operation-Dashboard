import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { DEFAULT_MODULE, MODULE_ROUTES } from "./config";

// Handle default module redirection before rendering the app
function handleDefaultModuleRedirection() {
  // Get current path without any query parameters
  const currentPath = window.location.pathname;
  
  // Get the base path and check if we are already in a module path
  const pathWithoutTrailingSlash = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
  const segments = pathWithoutTrailingSlash.split('/').filter(Boolean);
  
  // Check if the first segment is already a known module
  const firstSegmentIsModule = segments.length > 0 && Object.values(MODULE_ROUTES).some(route => 
    route === '/' + segments[0] || route === segments[0]
  );
  
  // If we're at root or in a non-module subfolder, and default is not dashboard
  if ((!firstSegmentIsModule || segments.length === 0) && DEFAULT_MODULE !== "dashboard") {
    // Get base path (if in a subfolder)
    let basePath = '';
    if (segments.length === 1 && !firstSegmentIsModule) {
      basePath = '/' + segments[0];
    }
    
    // Construct the path to redirect to
    const redirectPath = MODULE_ROUTES[DEFAULT_MODULE];
    const targetPath = basePath + redirectPath;
    
    // Prevent duplicate paths like /shipments/shipments
    const wouldCreateDuplicate = redirectPath !== '/' && 
      currentPath.includes(redirectPath + redirectPath.slice(1));
    
    // Only redirect if we're not already there and wouldn't create a duplicate path
    if (currentPath !== targetPath && !wouldCreateDuplicate) {
      console.log(`Redirecting to default module: ${DEFAULT_MODULE} (${targetPath})`);
      window.location.pathname = targetPath;
      return false; // Don't render the app yet
    }
  }
  
  return true; // Continue with rendering
}

// Only render the app if we're not redirecting
if (handleDefaultModuleRedirection()) {
  createRoot(document.getElementById("root")!).render(<App />);
}
