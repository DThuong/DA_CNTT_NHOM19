import React, { memo, useRef, useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { VoteOptions } from '../utils/contants'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import Button from './Button'

const VoteOption = ({ nameProduct, handleSubmitVote }) => {
  const modalRef = useRef()
  const [rating, setRating] = useState(0)
  const [comment, setcomment] = useState('')
  const [score, setscore] = useState(null)
  useEffect(() => {
    modalRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [])

  const handleStarClick = (index) => {
    setRating(index)
  }

  return (
    <div onClick={(e) => e.stopPropagation()} ref={modalRef} className='bg-white w-[700px] p-4 gap-4 flex flex-col items-center justify-center'>
      <img src={logo} alt='logo' className='w-[300px] my-4 object-contain' />
      <h2 className='text-center text-medium text-lg'>{`Đánh giá sản phẩm ${nameProduct}`}</h2>
      <textarea className='border-2 border-red-100 hover:border-red-500 form-textarea w-full p-4' placeholder='Type something' value={comment} onChange={e => setcomment(e.target.value)}></textarea>
      <div className='w-full flex flex-col gap-4'>
        <p>Bạn cảm thấy như thế nào về sản phẩm này ?</p>
        <div className='flex items-center justify-center gap-4 flex-nowrap'>
          {VoteOptions.map((el, index) => (
            <div
              className={`w-[100px] h-[100px] bg-gray-100 rounded-md cursor-pointer p-4 flex items-center justify-center gap-2 flex-col ${rating >= index + 1 ? 'bg-yellow-300' : ''}`}
              key={el.id}
              onClick={() => handleStarClick(index + 1)}
            >
              {rating >= index + 1 ? <AiFillStar color='orange' /> : <AiOutlineStar color='gray' />}
              <span className='text-center text-xs truncate'>{el.text}</span>
            </div>
          ))}
        </div>
      </div>
      <Button name="Gửi đánh giá" handleOnClick={() => handleSubmitVote({ comment, score: rating })}/>
    </div>
  )
}

export default memo(VoteOption)
