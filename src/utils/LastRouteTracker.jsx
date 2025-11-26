import {useLocation} from "react-router-dom";
import {useLayoutEffect, useRef} from "react";

export default function LastRouteTracker() {
    const location = useLocation();
    const prevPathRef = useRef(location.pathname);

    useLayoutEffect(() => {
        const prev = prevPathRef.current;
        const curr = location.pathname;

        if (prev !== curr) {
            try {
                sessionStorage.setItem("qm:lastRoute", prev);
            } catch {
                /* ignore */
            }
            prevPathRef.current = curr;
        }
    }, [location.pathname]);

    return null;
}


