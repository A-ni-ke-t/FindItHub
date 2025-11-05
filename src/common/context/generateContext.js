import React, { createContext, useContext, useMemo } from "react";

function generateHookName(baseName = "") {
  return `${baseName || "this"}Context`;
}

function generateProviderName(baseName = "") {
  return `${baseName.split("use")?.[1] || "this"}Provider`;
}

function generateContext(useGetContextValue) {
  const functionName =
    useGetContextValue.displayName || useGetContextValue.name;

  const hookName = generateHookName(functionName);
  const providerName = generateProviderName(functionName);
  const Context = createContext(undefined);

  const errorMessage = `${hookName} hook must be used within ${providerName}`;

  const Provider = (props) => {
    const { children, ...restProps } = props;
    const contextValue = useGetContextValue(restProps);

    const value = useMemo(() => {
      return { ...restProps, ...contextValue };
    }, [contextValue, restProps]);

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const useThisContext = () => {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(errorMessage);
    }
    return context;
  };

  return [Provider, useThisContext, Context];
}

export default generateContext;
