import { useLottie } from "lottie-react";
import LoadingAnimation from "@public/animations/84c1c87f-36f8-4dca-939e-25f15bbbd0a8.json";

export const RobotInvestasi = () => {
  const options = {
    animationData: LoadingAnimation,
    loop: true,
    autoplay: true,
    style: {
      width: '300px', // Adjust the width as needed
      height: '300px', // Optional: Adjust the height as needed
    },
  };

  const { View } = useLottie(options);

  return <>{View}</>;
};
