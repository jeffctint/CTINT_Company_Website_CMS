import Image from "next/image";
import Loading from "/public/images/loading.png";
const LoadingComponent = () => {
  return (
    <div className="container">
      <svg viewBox="0 0 100 100">
        <defs>
          <filter id="shadow">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="1.5"
              flood-color="#fc6767"
            />
          </filter>
        </defs>
        <circle
          id="spinner"
          fill="transparent"
          stroke="#F7971D"
          stroke-width="3px"
          stroke-linecap="round"
          filter={"url(#shadow)"}
          cx="50"
          cy="50"
          r="45"
        />
        <path
          d="M25 49.5703C25.9321 61.6074 35.5984 71.1907 47.6764 71.9986V56.6647C47.6764 52.7465 44.4983 49.5703 40.5778 49.5703H25Z"
          fill="#F7971D"
        />
        <path
          d="M75.2545 49.457C74.3231 61.4941 64.6561 71.0774 52.5781 71.8853V56.5514C52.5781 52.6332 55.7562 49.457 59.6767 49.457H75.2553H75.2545Z"
          fill="#30302F"
        />
        <path
          d="M69.162 44.1719C72.1409 41.1947 72.1409 36.3678 69.162 33.3906C66.1831 30.4135 61.3532 30.4135 58.3743 33.3906C55.3954 36.3678 55.3954 41.1947 58.3743 44.1719C61.3532 47.149 66.1831 47.149 69.162 44.1719Z"
          fill="#30302F"
        />
        <path
          d="M41.7011 44.1719C44.68 41.1947 44.68 36.3678 41.7011 33.3906C38.7221 30.4135 33.8923 30.4135 30.9134 33.3906C27.9344 36.3678 27.9344 41.1947 30.9134 44.1719C33.8923 47.149 38.7221 47.149 41.7011 44.1719Z"
          fill="#F7971D"
        />
      </svg>
    </div>
  );
};

export default LoadingComponent;

// <div className="container">
//   <div className="loader">
//     <span></span>
//   </div>
//   <div className="loader">
//     <span></span>
//   </div>

//   <div className="loader">
//     <i></i>
//   </div>

//   <div className="loader">
//     <i></i>
//   </div>
//   <Image src={Loading} width={70} height={70} alt={""} className="z-10" />
// </div>
