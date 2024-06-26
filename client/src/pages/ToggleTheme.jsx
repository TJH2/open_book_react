import React, { useState, useEffect } from "react"
import Cookies from 'js-cookie'

export function ToggleTheme() {
    const [isDarkMode, setIsDarkMode] = useState(true);

    function toggleTheme() {
        setIsDarkMode((prevMode) => !prevMode);
        if (!isDarkMode) {
            Cookies.set('theme', true, { expires: 7, sameSite:'strict', secure: true }); // SETS COOKIE TRUE
            document.documentElement.classList.add("dark-theme");
            document.documentElement.classList.remove("light-theme");
        } else {
            Cookies.set('theme', false, { expires: 7, sameSite:'strict' }); // SETS COOKIE FALSE
            document.documentElement.classList.add("light-theme");
            document.documentElement.classList.remove("dark-theme");
        }
    }

    // USEEFFECT() TO HANDLE COOKIES/MODE CONTEXT BUG
    useEffect(() => {

        const Theme = Cookies.get("theme"); // COOKIE VALUE IF IT EXISTS, OR UNDECLARED

        if(Theme) { // IF IT EXISTS DISPLAY PROPER MODE SETTING

            if(Theme === 'true') {
                setIsDarkMode(true); // SETS DARKMODE TO THEME VALUE
                document.documentElement.classList.add("dark-theme");
                document.documentElement.classList.remove("light-theme");
            } else if(Theme === 'false') {
                setIsDarkMode(false); // SETS DARKMODE TO THEME VALUE
                document.documentElement.classList.add("light-theme");
                document.documentElement.classList.remove("dark-theme");
            }
        } else { // FIXES A BUG WHERE IS USER LOGS OUT IN DARKMODE AND LOGS BACK IN, IT'S STILL THE DARK MODE CLASS BUT TOGGLE DOESN'T RECOGNIZE IT
            document.documentElement.classList.add("dark-theme")
                setIsDarkMode(true);
        }
    }, [])

    return (
        <span onClick={toggleTheme} className="nav-link">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
        </span>
    ); {/* running the toggleTheme to set css styles to opposite of current */}
}
