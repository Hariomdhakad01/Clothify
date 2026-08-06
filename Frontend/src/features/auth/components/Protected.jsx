import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const Protected = ({children, role="buyer"}) => {

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)
    const authChecked = useSelector(state => state.auth.authChecked)

    if(loading || !authChecked){
        return <div>Loading......</div>
    }

    if(!user){
        return <Navigate to="/login" replace/>
    }
    if(user.role !== role){
        return <Navigate to="/" replace/>
    }

  return children
  
}

export default Protected
