"use client";

import { createContext } from "react";

export const WebCamContext = createContext({
  webCamEnabled: false,
  setWebCamEnabled: () => {},
});
