const LoadingScreen = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
    <dotlottie-wc
      src="https://lottie.host/24521134-fd2b-4d48-8f69-37de7dd363ce/zUJjVSfKxJ.lottie"
      style={{ width: 300, height: 300 }}
      autoplay
      loop
    />
  </div>
);

export default LoadingScreen;
