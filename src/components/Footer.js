import React from "react";
import FavoriteIcon from "@material-ui/icons/Favorite";

function Footer() {
    return (
        <div className="footer">
            <div>
                <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank">
                    <img src={require('../images/cc.png')} alt="creative commons"/></a>
                <a href="https://opentdb.com/" target="_blank">Credit</a>
            </div>
            <p className="made-by">Made with
                <span><FavoriteIcon style={{color: 'red', transform: 'scale(0.8)'}}>favorite</FavoriteIcon></span>
                by <a href="https://github.com/matiascfgm" target="_blank">Matias Kupfer</a>
            </p>
        </div>
    )
}

export default Footer;
