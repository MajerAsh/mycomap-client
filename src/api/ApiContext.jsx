// API client with auth header support + simple tag invalidation

import { createContext, useContext, useRef, useCallback, useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiRequest, API } from "./apiClient";

export { API };

const ApiContext = createContext(null);

export function ApiProvider({ children }) {
  const { token } = useAuth();

  const request = useCallback(
    (resource, options = {}, isFormData = false) =>
      apiRequest(resource, options, { token, isFormData }),
    [token],
  );

  const tagsRef = useRef({});

  const provideTag = useCallback((tag, query) => {
    tagsRef.current[tag] = query;
  }, []);

  const invalidateTags = useCallback((tagsToInvalidate) => {
    const list = Array.isArray(tagsToInvalidate)
      ? tagsToInvalidate
      : tagsToInvalidate
        ? [tagsToInvalidate]
        : [];
    list.forEach((tag) => tagsRef.current[tag]?.());
  }, []);

  const value = useMemo(
    () => ({ request, provideTag, invalidateTags }),
    [request, provideTag, invalidateTags],
  );
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

//Hook to use the api helpers in components, must use w/in <ApiProvider>
export function useApi() {
  const context = useContext(ApiContext);
  if (!context) throw Error("useApi must be used within a ApiProvider");
  return context;
}
