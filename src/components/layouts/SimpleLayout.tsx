import Header from '@/components/template/Header'
import SidePanel from '@/components/template/SidePanel'
import UserDropdown from '@/components/template/UserDropdown'
import LanguageSelector from '@/components/template/LanguageSelector'
import Notification from '@/components/template/Notification'
import HeaderLogo from '@/components/template/HeaderLogo'
import Search from '@/components/template/Search'
import MobileNav from '@/components/template/MobileNav'
import HorizontalNav from '@/components/template/HorizontalNav'
import View from '@/views'
import { UserDetailsProvider } from '@/views/Context/userdetailsContext'

const HeaderActionsStart = () => {
    return (
        <>
            <HeaderLogo />
            <MobileNav />
        </>
    )
}

const HeaderActionsEnd = () => {
    return (
        <>
            <Search />

            <Notification />
            <SidePanel />
            <UserDetailsProvider>
            <UserDropdown hoverable={false} />
            </UserDetailsProvider>
        </>
    )
}

const SimpleLayout = () => {
    return (
        <div className="app-layout-simple flex flex-auto flex-col min-h-screen">
            <div className="flex flex-auto min-w-0">
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <Header
                        container
                        className="shadow dark:shadow-2xl"
                        headerStart={<HeaderActionsStart />}
                        headerMiddle={<HorizontalNav />}
                        headerEnd={<HeaderActionsEnd />}
                    />
                    <View pageContainerType="contained" />
                </div>
            </div>
        </div>
    )
}

export default SimpleLayout
