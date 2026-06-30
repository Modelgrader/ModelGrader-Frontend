import { useEffect, useState } from "react";
import "./App.css";
import { Toaster } from "./components/shadcn/Toaster";
import {
	CourseNavSidebarContext,
	GetCourseNavSidebarContextStateValue,
} from "./contexts/CourseNavSidebarContext";
import { LoginContext } from "./contexts/LoginContext";
import { NavSidebarContext } from "./contexts/NavSidebarContext";
import Router from "./router";
import { AuthService } from "./services/Auth.service";

function App() {
  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [section, setSection] = useState("");
  const [isOpenNavSidebar, setIsOpenNavSidebar] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const accountId = localStorage.getItem("account_id");

    if (!accessToken || !accountId) {
      setIsLogin(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      if (!isExpired) {
        setIsLogin(true);
        return;
      }
    } catch {
      // malformed token — fall through to refresh
    }

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      setIsLogin(false);
      return;
    }

    AuthService.refreshToken(refreshToken).then((response) => {
      localStorage.setItem("access_token", response.data.access_token);
      setIsLogin(true);
    }).catch(() => {
      localStorage.clear();
      setIsLogin(false);
    });
  }, []);

  return (
    <div>
      <div className="App">
        <LoginContext.Provider value={{ isLogin, setIsLogin }}>
          <NavSidebarContext.Provider
            value={{
              section,
              setSection,
              isOpen: isOpenNavSidebar,
              setIsOpen: setIsOpenNavSidebar,
            }}
          >
            <CourseNavSidebarContext.Provider
              value={GetCourseNavSidebarContextStateValue()}
            >
              <Router />
              <Toaster />
            </CourseNavSidebarContext.Provider>
          </NavSidebarContext.Provider>
        </LoginContext.Provider>
      </div>
    </div>
  );
}

export default App;
