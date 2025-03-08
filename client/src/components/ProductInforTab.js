import React, { useState } from "react";
import { productInfor } from "../utils/contants";
import { Votebar, Button, VoteOption } from "./";
import { renderStar } from "../utils/helpers";
import { apiRatings } from "../apis";
import { Comment } from "./";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../store/app/appSlice";
import Swal from "sweetalert2";
import path from "../utils/path";
import { useNavigate } from "react-router-dom";

const ProductInforTab = ({
  totalRatings,
  ratings,
  nameProduct,
  pid,
  rerender,
}) => {
  const [activeTab, setActiveTab] = useState(1);
  const { isLoggedIn } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const isActive = (id) => id === activeTab;
  const dispatch = useDispatch();

  const [payload, setpayload] = useState({ comment: "", score: "" });

  const handleSubmitVote = async ({ comment, score }) => {
    if (!comment || !score || !pid) {
      alert("Please vote when click submit");
      return;
    }
  
    // Cập nhật thời gian hiện tại
    const updatedAt = Date.now();
    
    // Gọi API để cập nhật hoặc thêm mới bình luận
    await apiRatings({ star: score, comment, pid, updatedAt });
    dispatch(showModal({ isShowModal: false, modalChildren: null }));
    rerender();
  };
  

  const handleVoteNow = () => {
    if (!isLoggedIn) {
      Swal.fire({
        text: "Login to Vote",
        cancelButtonText: "Cancel",
        confirmButtonText: "Go login",
        showCancelButton: true,
        title: "Oops!",
      }).then((rs) => {
        if (rs.isConfirmed) {
          navigate(`/${path.LOGIN}`);
        }
      });
    } else {
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: (
            <VoteOption
              nameProduct={nameProduct}
              handleSubmitVote={handleSubmitVote}
            />
          ),
        })
      );
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* Các tab cho sản phẩm */}
      <div className="flex items-center gap-2 relative bottom-[-1px]">
        {productInfor.map((el) => (
          <span
            key={el.id}
            className={`py-2 px-4 cursor-pointer ${
              isActive(el.id)
                ? "bg-gray-200 text-black"
                : "bg-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>

      {/* Nội dung mô tả sản phẩm (Warranty, Description, Delivery,...) */}
      <div className="w-full border p-4">
        {productInfor?.some((el) => el.id === activeTab) &&
          productInfor.find((el) => el.id === activeTab)?.content}
      </div>

      {/* Tách biệt phần Customer Reviews và Comments */}
      <div className="w-full border-t p-4 mt-4">
        
        {(
          <div className="flex flex-col p-4">
            <div className="flex mb-4">
              <div className="flex-4 flex flex-col gap-2 items-center justify-center border border-red-500">
                <span className="text-3xl">{`${totalRatings}/5`}</span>
                <span className="flex items-center gap-1">
                  {renderStar(totalRatings)?.map((el, idx) => (
                    <span key={idx}>{el}</span>
                  ))}
                </span>
                <span>{`${ratings?.length} reviewer`}</span>
              </div>
              <div className="flex-6 border p-4 flex flex-col gap-2">
                {Array.from(Array(5).keys())
                  .reverse()
                  .map((el) => (
                    <Votebar
                      key={el}
                      number={el + 1}
                      ratingCount={
                        ratings?.filter((i) => i.star === el + 1)?.length
                      }
                      ratingTotal={ratings?.length}
                    ></Votebar>
                  ))}
              </div>
            </div>

            {/* Phần nút đánh giá ngay */}
            <div className="p-4 flex items-center justify-center text-sm flex-col gap-2">
              <span>Bạn có muốn đánh giá sản phẩm này ?</span>
              <Button name="Đánh giá ngay" handleOnClick={handleVoteNow}></Button>
            </div>
          </div>
        )}
      </div>

      {/* Phần bình luận (comment) được tách biệt */}
      {(
        <div className="w-full border-t p-4 mt-4">
          <div className="flex flex-col gap-4">
            {ratings?.map((el) => (
              <Comment
                key={el._id}
                star={el.star}
                comment={el.comment}
                updatedAt={el.updatedAt}
                name={`${el.postedBy?.lastname} ${el.postedBy?.firstname}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInforTab;
