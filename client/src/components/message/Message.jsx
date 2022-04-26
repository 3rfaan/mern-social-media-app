import "./message.css";

const Message = ({ message, own }) => {
  return (
    <div className={own ? "message own" : "message"} key={message?._id}>
      <div className="messageTop">
        <img src="" alt="" className="messageImg" />
        <p className="messageText">{message?.text}</p>
      </div>
      <div className="messageBottom">{message?.createdAt}</div>
    </div>
  );
};

export default Message;
