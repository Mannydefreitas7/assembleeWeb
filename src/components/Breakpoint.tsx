import { ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';

const Mobile = ({ children } : { children: ReactNode }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}

const Desktop = ({ children }: { children: ReactNode }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    return isDesktop ? children : null

}