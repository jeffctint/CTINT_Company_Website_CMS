import Image from "next/image";
import Loading from "/public/images/loading.png";
const LoadingComponent = () => {
  return (
    <div className="container">
      <div className="loader">
        <span></span>
      </div>
      <div className="loader">
        <span></span>
      </div>

      <div className="loader">
        <i></i>
      </div>

      <div className="loader">
        <i></i>
      </div>
      <Image src={Loading} width={70} height={70} alt={""} className="z-10" />
    </div>
  );
};

export default LoadingComponent;
