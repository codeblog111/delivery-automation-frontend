import React, { useState } from 'react';
import "./PreLogin.css";
import log from "../img/log.svg";
import register from "../img/register.svg";
import Logo from "../img/Logo.png"

function PreLogin({ setShouldContinue }) {
    const [signup, setSignup] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleAccessRequest = (event) => {
        event.preventDefault();
        if(username === "Jane Doe" && password === "StrategizeAI") {
            setShouldContinue(true);
        }
        return;
    }

    return (
        <div className={`container ${signup}`}>
        <div className="forms-container">
            <div className="signin-signup">
            <form action="#" className="sign-in-form">
                <img src={Logo} id="company-logo" alt="" srcset="" />
                <h2 className="title">Go To Dashboard</h2>
                <div className="input-field">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
                </div>
                <div className="input-field">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </div>
                <input type="submit" value="Proceed" className="btn solid" onClick={handleAccessRequest} />
            </form>
            <form action="#" className="sign-up-form">
                <img src={Logo} id="company-logo" alt="" srcset="" />
                <h2 className="title">Go To Dashboard</h2>
                <div className="input-field">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
                </div>
                <div className="input-field">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </div>
                <input type="submit" className="btn" value="Proceed" onClick={handleAccessRequest} />
            </form>
            </div>
        </div>

        <div className="panels-container">
            <div className="panel left-panel">
            <div className="content">
                <h3>Access the dashboard</h3>
                <p>
                Please enter the necessary credentials to proceed to the dashboard.
                </p>
                <button className="btn transparent" id="sign-up-btn" onClick={() => setSignup("sign-up-mode")}>
                 ➡
                </button>
            </div>
            <img src={log} className="image" alt="" />
            </div>
            <div className="panel right-panel">
            <div className="content">
                <h3>One of us ?</h3>
                <p>
                If you are one of our company members please enter our security credentials to proceed to the dashboard.
                </p>
                <button className="btn transparent" id="sign-in-btn" onClick={() => setSignup("")}>
                 ⬅
                </button>
            </div>
            <img src={register} className="image" alt="" />
            </div>
        </div>
        </div>
    )
}

export default PreLogin