import React from "react";
import "./aboutUs.css";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Link, useNavigate } from 'react-router-dom';

const AboutUs = () => {

  function toggleVideo() {
    var videoFrame = document.getElementById("videoFrame");
    if (videoFrame.style.display === "none") {
      videoFrame.style.display = "block";
    } else {
      videoFrame.style.display = "none";
    }
  }
let x 
console.log(typeof typeof(x))
  return (
    <div className="containerrr">
      <main>
        <article>
        <div className="introduction">
          <h1 className="text-dark">Hello Dear, we are AllMarT:</h1>
          <h2 className="text-dark">How to use this app?</h2>
        </div>
          <section>
            <h3>How to use Add material +</h3>
            <p>
              With AllMarT, adding materials to your inventory is a breeze. Simply navigate to the "Add Material +" section, fill in the necessary details, and you're all set. Say goodbye to manual data entry and embrace the efficiency of AllMarT.
            </p>
          </section>
          <section>
            <h3>How to use see material</h3>
            <p>
              In the "See Material" section, you can effortlessly track all your materials in real-time. No more stockouts or inventory woes – AllMarT ensures that you always have the right materials at the right time.
            </p>
          </section>
          <section>
            <h3>Dashboard: Empower Your Business</h3>
            <p>
              AllMarT's powerful dashboard provides you with full control over your data. You can easily manage and CRUD (Create, Read, Update, Delete) materials, workers, and job posts with just a few clicks. Personalize your dashboard to tailor it to your business needs and gain valuable insights into your business performance with data visualization using Chart.js.
            </p>
          </section>
          <section onClick={toggleVideo}>
            <h3>Video</h3>
            <div className="embed-responsive embed-responsive-16by9">
              <iframe title="explainig uses app for" className="embed-responsive-item" src="https://www.youtube.com/embed/Jd2GK0qDtRg" allowFullScreen autoplay muted></iframe>
            </div>
          </section>
          <section>
            <h3>Contact Us</h3>
            <p>
              Got questions or need assistance? Our dedicated support team is here for you. In the "Contact Us" section, you can find our contact details. Feel free to reach out anytime, and we'll be more than happy to assist you.
            </p>
            <div className="Links">
              <div className="avatar">
                <img src='https://res.cloudinary.com/dktkavyr3/image/upload/v1688848119/xgewlo5w1rcgz9qfjacf.jpg' alt="Avatart of dev" />
              </div>
            <Link to='https://www.linkedin.com/in/younes-raymond-188a40241/'>
            <label htmlFor="">Younes Raymond: </label>
            <LinkedInIcon /> 
            </Link>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
};

export default AboutUs;
