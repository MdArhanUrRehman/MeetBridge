import "../styles/Footer.css"

export default function Footer() {
  return (
    <div className="footerWrapper">
      <div className="footerContainer">
        {/* Logo & description */}
        <div className="footerIntro">
          <p className="footerText">
           “Connect instantly with colleagues, friends, or clients from anywhere. High-quality video and audio, real-time chat, and easy scheduling make your meetings seamless and productive.”
          </p>
        </div>

        {/* Company Links */}
        

        {/* Contact Info */}
        <div className="footerContact">
          <p className="footerHeading">GET IN TOUCH</p>
          <ul>
            <li>+91 9916234635</li>
            <li>arhanurrehman12@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className="footerBottom">
        <hr />
        <p>Copyright 2025 @Meet Bridge.com - All Rights Reserved.</p>
      </div>
    </div>
  )
}
