import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LoadingScreen = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
    <DotLottieReact
      src="https://lottie.host/4d866bf1-7a54-48c6-9c5c-ac770c7a3c12/CHSlCtBvwC.lottie"
      loop
      autoplay
      style={{ width: 220, height: 220 }}
    />
  </div>
);

export default LoadingScreen;
