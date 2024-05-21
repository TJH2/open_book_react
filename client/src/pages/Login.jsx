import { useNavigate, Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import Cookies from 'js-cookie'
import axios from "axios"
import moment from "moment";

export function Login() {

    // AUTH FUNCTIONS ------------------------------------------------------------------------------------------------------------------
    
    const navigate = useNavigate();
    const initialized = useRef(false); // RE-USABLE HOOK TO MAKE SURE THINGS DON'T DOUBLE LOAD AT START

    useEffect(() => { // PREVENTS USER FROM GOING BACK TO LOGGIN PAGE IF ALREADY LOGGED IN
        if (!initialized.current) { // MAKES SURE USEFFECT TRIGGERS ONLY ONCE
            initialized.current = true
            const user = Cookies.get("username");
            if(user) {
             navigate('/homepage')
            }
    }}, [])

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    function HandleLogIn(e) {
        e.preventDefault()

        if(username === "" || password === "") { // CHECKS TO SEE IF USERS PUT IN A USERNAME & PASSWORD
            document.querySelector(".ls-warning").innerText = "Please Provide a Username & Password";
            document.querySelector(".ls-warning").style.color = "lightcoral";
            setPassword("");
            return;
        }

        axios.get('http://localhost:5000/users/username', { 
            params: {
                username: username,
            } 
        } ).then(
            response => {
                console.log(moment().diff(moment(response.data[0].updatedAt), 'hours'));
                console.log(moment().diff(moment(response.data[0].updatedAt), 'minutes'));
                console.log(moment().diff(moment(response.data[0].updatedAt), 'seconds'));
                    if (response.data[0].loggedIn === true) { // SO TWO USERS CAN'T LOG IN ON THE SAME ACCOUNT

                        document.querySelector(".ls-warning").innerText = "This Account is Already Logged in on Another Device";
                        document.querySelector(".ls-warning").style.color = "lightcoral";
                        return;
                    } 

                    const checkPass = response.data[0].password; // CURRENT DATABASE PASSWORD

                    axios.get('http://localhost:5000/encrypt',{ params: {password: password }}).then(
                        response => {
                            if(checkPass === response.data) { // IF PASSWORDS MATCH
                        
                            axios.patch('http://localhost:5000/users/loggedin', { // UPDATE LOGGED IN STATUS
                                username: username, loggedIn: true,
                            }).then (
                                response => {
                                    console.log(response.data);
                                    Cookies.set("username", username, { expires: 7 }); // SETS COOKIE AND CONTEXT
                                    navigate('/homepage') // NAVIGATES TO HOMEPAGE AFTER REST OF FUNCTION RESOLVES
                            }).catch(error => {
                                console.log(error.message);
                                return;
                            })
                            } else {
                                document.querySelector(".ls-warning").innerText = "Username & Password Do Not Match";
                                document.querySelector(".ls-warning").style.color = "lightcoral";
                                setPassword("");
                                return;
                            }
                        }
                    )
            }
        ).catch(error => {
            console.log(error.message);
            document.querySelector(".ls-warning").innerText = "Username Does Not Exist";
            document.querySelector(".ls-warning").style.color = "lightcoral";
            setPassword("");
            return;
        })
    }

    return <>
        <h3 className="sign-log"><Link to="/">Sign Up</Link> or Log In</h3>
        <form className="ls-form" onSubmit={(e)=>{HandleLogIn(e)}}>
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} maxLength={10} />
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} maxLength={15} />
            <p className="ls-warning">Sample Warning Message</p>
            <button className="btn">Login</button>
        </form>
    </>
   }