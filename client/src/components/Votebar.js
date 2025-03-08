import React, {useRef, useEffect} from "react";
import { AiFillStar } from "react-icons/ai";

const Votebar = ({ number, ratingCount, ratingTotal }) => {
  const percentRef = useRef()
  const percent = Math.round(ratingCount*100 / ratingTotal) || 0
  useEffect(() => {
    percentRef.current.style.cssText = `right: ${100 - percent}%`
  },[ratingCount, ratingTotal])
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <div className="flex flex-1 items-center justify-center gap-1 text-sm">
        <span>{number} </span>
        <AiFillStar color="orange" />
      </div>
      <div className="w-[75%] flex-8">
        <div className="w-full h-[6px] relative bg-gray-200 rounded-l-full rounded-r-full">
          <div ref={percentRef} className="absolute inset-0 bg-red-500 right-8"></div>
        </div>
      </div>
      <div className="w-[15%] flex-2 text-xs text-400 flex justify-end">{`${
        ratingCount || 0
      } reviewer`}</div>
    </div>
  );
};

export default Votebar;
