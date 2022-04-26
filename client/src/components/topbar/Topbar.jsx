import "./topbar.css";
import { Chat, Notifications, Person, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Topbar = () => {
  const { user } = useContext(AuthContext);

  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/">
          <span className="logo">Social App</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? publicFolder + user.profilePicture
                : publicFolder + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
