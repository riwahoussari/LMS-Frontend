import Lottie from "lottie-react";
import LoadingRippleLottie from "../../assets/loading-ripple.json";

export default function LoadingDiv()
{
    return <div className="fixed top-0 left-0 right-0 bottom-0 z-100 flex items-center justify-center">
        <Lottie animationData={LoadingRippleLottie} />
      </div>
}