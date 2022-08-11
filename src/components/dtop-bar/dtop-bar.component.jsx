import React  from "react";
import { Link } from 'react-router-dom';
import { NavbarData } from "../../dUtil/dNavbar/dNavbar.data";
import { FaUserTie } from 'react-icons/fa';
import { FcBusinessman } from "react-icons/fc";
import { useAuth } from '../../contexts/AuthContext';


import "./dtop-bar.styles.css";

function DTopBar() {
    const {
        auth,
        logout,
      } = useAuth();

    const signOut = () => {
        logout();
    }

    return (
        <div className='header'>
            <div className="navbar">
                <div className="profileDiv">
                    {auth.isAuthenticated ?
                        <div>
                            <FaUserTie
                                onClick={signOut}
                                // title={auth.isAuthenticated}
                                style={{ fontSize: 30, color: "white" }}
                            />
                            <span style={{color: '#f9eeee', 
                            display: 'inline-block', width: '20px', height: '10px', textAlign: 'center'}}>
                                {/* {"firstName"} */}
                            </span>
                        </div> :
                        <FaUserTie style={{ fontSize: 30, color: "white" }} />
                    }
                </div>
                <div className="menu-div">
                    {auth.isAuthenticated && NavbarData.map((item, index) => {
                        return (
                             <li key={index} className={item.cName}>
                                 <Link to={item.path}>{item.title}</Link>
                            </li>
                        );
                    })}
                </div>
                <div className="logo-div">
                    <img className='image' 
                    src={`${process.env.PUBLIC_URL}/images/images1.png`}
                     width='50px' height='40px' onClick={signOut}></img>
                </div>
            </div>
        </div>
    );
}
export default DTopBar;
