import "../styles/LandingPage.css";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import LandingPageImage from "../assets/LandingPage.svg";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="landingPageContainer">
        <section className="landingContainer">
          <div className="left-side">
            <h2>Connect with your loved ones</h2>
            <p className="subtitle">Cover a distance by Video Call</p>
            <Link to="/home" className="start-button">
              Get Started
            </Link>
          </div>

          <div className="right-side">
            <img
              src={LandingPageImage}
              alt="People connecting through a video call"
            />
          </div>
        </section>

        <section className="aboutContainer">
          <div className="aboutHeader">
            <h2>
              ABOUT US
            </h2>
            <p>Connecting you with your loved ones anytime, anywhere.</p>
          </div>

          <div className="featuresContainer">
            <div className="featureCard">
              <h3>VIDEO & AUDIO</h3>
              <p>
                Enjoy smooth, crystal-clear video meetings with adaptive quality
                for any network.
              </p>
            </div>

            <div className="featureCard">
              <h3>REAL-TIME CHAT</h3>
              <p>
                Stay connected with built-in text chat during calls—share links
                or reactions without interrupting the conversation.
              </p>
            </div>

            <div className="featureCard">
              <h3>INSTANT SCHEDULING</h3>
              <p>
                Create or join meetings in seconds with a single link—no complex
                setup required.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
