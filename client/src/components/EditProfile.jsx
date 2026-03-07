import React from 'react'
import { useState } from 'react';

const EditProfile = () => {

    const [isOpen , setIsOpen ] = useState(false);
    const [bio, setBio] = useState(user?.bio || "");

    const handleSubmit = async () =>{
      e.preventDefault();

      try {
 
        const { data } = await API.put('/users/update-profile' ,  {
            bio , 
            fullname 
        })

      } catch (error) {
        
      }
    }

  return (
    <div>
        <button onClick={(e)=>{setIsOpen(!isOpen)}}>Edit Profile</button>

        {
            isOpen && <div>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={bio} onChange={(e)=>setIsOpen(e.target.value)}/>
                </form>
                <button type='submit'>Submit</button>
            </div>
        }
    </div>
  )
}

export default EditProfile
