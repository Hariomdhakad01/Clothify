import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const Protected = ({children, role="buyer"}) => {
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)
    const authChecked = useSelector(state => state.auth.authChecked)

    if(loading || !authChecked){
        return <div className="min-h-screen bg-[#f5f7f4] px-6 py-10 text-[#10201d]">Loading...</div>
    }

    if(!user){
        return <Navigate to="/login" replace/>
    }
    if(role && user.role !== role){
        return <Navigate to="/" replace/>
    }

  return children
}

export default Protected
