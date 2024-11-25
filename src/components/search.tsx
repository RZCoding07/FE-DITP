import { Input } from '@/components/ui/input'
import cookie from 'js-cookie'
export function Search() {

  const user = cookie.get('user')
  const account_type = user ? JSON.parse(user).account_type : ''
  console.log(user)
  return (

    <div>
<h1>Evolution for Palm Agribusiness Lifecycle Management System</h1>
    </div>
  )
}
