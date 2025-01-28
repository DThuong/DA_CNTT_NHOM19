import React, {useState} from 'react'
import { Button } from '../../components'
import { useParams } from 'react-router-dom'
import { apiResetPassword } from '../../apis/user'
import { toast } from 'react-toastify'
const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const {token} = useParams()
  // console.log(token);
  const handleResetPassword = async () => {
    // console.log({password, token});
    const res = await apiResetPassword({password, token})
    if(res.success){
      toast.success(res.msg, { theme: 'colored'});
    }else{
      toast.info(res.msg, { theme: 'colored'});
    }
  }
  return (
    <div className="absolute top-0 right-0 left-0 bottom-0 bg-white flex justify-center py-8 z-50">
    <div className="flex flex-col gap-4">
      <label htmlFor="password">Enter new password: </label>
      <input
        type="text"
        id="password"
        className="w-[800px] pb-4 border-b outline-none placeholder:text-sm"
        placeholder="example: abc123@#"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex items-center justify-end w-full gap-2">
      <Button name="Submit" handleOnClick={handleResetPassword} className="px-4 py-2 rounded-md text-white bg-blue-500 text-semibold w-full outline-none"/>
    </div>
    </div>
    
  </div>
  )
}

export default ResetPassword