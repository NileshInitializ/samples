import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useAuth from '@/utils/hooks/useAuth'
import { useAppSelector } from '@/store'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import {  HiOutlineLogout, HiOutlineUserAdd } from 'react-icons/hi'
import type { CommonProps } from '@/@types/common'
import { AiOutlineUser, AiOutlineUserAdd, } from 'react-icons/ai'
import { useContext } from 'react'
import { UserDetailsContext } from '@/views/Context/userdetailsContext'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

const dropdownItemList: DropdownList[] = [
    {
        label:"My Profile",
        path:"/app/crm/profile",
        icon:<AiOutlineUser/>
    
        },
    {
    label:"Add User to Project",
    path:"/app/crm/addmember",
    icon:<AiOutlineUserAdd/>

    },
    {
    label:"Add User to Lead",
    path:"/app/crm/addUserToLead",
    icon:<AiOutlineUserAdd/>

    },
    
    {
        label: 'Create User',
        path: '/app/crm/register',
        icon: <HiOutlineUserAdd />,
    },
    
]
const _UserDropdown = ({ className }: CommonProps) => {
    const role=localStorage.getItem('role')
    const data=useContext(UserDetailsContext)


    const {  authority, email } = useAppSelector(
        (state) => state.auth.user
    )
console.log(data);

    const { signOut } = useAuth()

    const UserAvatar = (
        <div className={classNames(className, 'flex items-center gap-2')}>
           <img src={data?.avatar} className='w-8' alt="" />
            <div className="hidden md:block">
                <div className="text-xs capitalize">
                    {authority?.[0] || 'guest'}
                </div>
               
            </div>
        </div>
    )

    return (
        <div>
            <Dropdown
                menuStyle={{ minWidth: 240 }}
                renderTitle={UserAvatar}
                placement="bottom-end"
            >
                <Dropdown.Item variant="header">
                    <div className="py-2 px-3 flex items-center gap-2">
                        <div>
                            <div className="font-bold text-gray-900 dark:text-gray-100">
                            </div>
                            <div className="text-xs">{email}</div>
                        </div>
                    </div>
                </Dropdown.Item>
                <Dropdown.Item variant="divider" />

                {role === 'ADMIN' &&dropdownItemList.map((item) => (
                    <>
                    <Dropdown.Item
                        key={item.label}
                        eventKey={item.label}
                        className="mb-1 px-0"
                    >
                        <Link 
                            className="flex h-full w-full px-2" 
                            to={item.path}
                        >
                            <span className="flex gap-2 items-center w-full">
                                <span className="text-xl opacity-50">
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </span>
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item variant="divider" />
                    </>
                ))}
                <Dropdown.Item
                    eventKey="Sign Out"
                    className="gap-2"
                    onClick={signOut}
                >
                    <span className="text-xl opacity-50">
                        <HiOutlineLogout />
                    </span>
                    <span>Sign Out</span>
                </Dropdown.Item>
            </Dropdown>
        </div>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
