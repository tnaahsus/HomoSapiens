import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import "../style/App.css";
import { RiFacebookCircleLine } from "react-icons/ri";
import {
  TiSocialLinkedinCircular,
  TiSocialTwitterCircular,
} from "react-icons/ti";
import { AiOutlineWhatsApp, AiOutlineMail } from "react-icons/ai";

const ShareButtons = ({ url, title, description }) => (
  <div className="post-meta-share-icons">
    <FacebookShareButton url={url} quote={description}>
      <RiFacebookCircleLine id="facebook" />
    </FacebookShareButton>

    <LinkedinShareButton url={url} title={title} summary={description}>
      <TiSocialLinkedinCircular id="linkedin" />
    </LinkedinShareButton>

    <TwitterShareButton url={url} title={description}>
      <TiSocialTwitterCircular id="twitter" />
    </TwitterShareButton>

    <WhatsappShareButton url={url} title={description}>
      <AiOutlineWhatsApp id="whatsapp" />
    </WhatsappShareButton>

    <EmailShareButton url={url} title={description}>
      <AiOutlineMail id="mail" />
    </EmailShareButton>
  </div>
);

export default ShareButtons;
