import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import path from '../../utils/path'
import Swal from 'sweetalert2'
const FinalRegister = () => {
    const {status} = useParams()
    const navigate = useNavigate()
    useEffect(() => {
      if(status === 'failed') Swal.fire('Oops','Đăng ký thất bại','error').then(() =>{
        navigate(`/${path.LOGIN}`, { state: { from: `/${path.FINAL_REGISTER}` } })
      })
      if(status === 'success') Swal.fire('Congratulation','Đăng ký thành công','success').then(() =>{
        navigate(`/${path.LOGIN}`, { state: { from: `/${path.FINAL_REGISTER}` } })
      })
    }, [])
  return (
    <div className='w-screen h-screen bg-gray-100'></div>
  )
}

export default FinalRegister