// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css'; // Import styles for the button class

const Home = () => {
  return (
    <div className="landing-page">
      <section id="home" className="landing-section">
        <div className="text-content">
          <h1>Welcome to LocalGovHub</h1>
          <p>
            LocalGovHub is your ultimate destination for staying connected to all the latest updates and happenings in your local government. 
            Whether it’s breaking news about new policies, detailed information on upcoming events, or a clear and concise summary of recent legislative changes, we’ve got it all in one place. 
            With LocalGovHub, you’ll never miss an important update that impacts your community.
          </p>
        </div>
        <img src="Community kids.jpg" alt="Community working together" />
      </section>

      <section className="landing-section">
        <img src="Calendar on laptop.jpg" alt="Tracking local events" />
        <div className="text-content">
          <h2>Stay Informed</h2>
          <p>
            Keeping up with local government activities can be overwhelming, but LocalGovHub simplifies the process for you. 
            Our platform compiles all the essential information about your community, including new laws, council decisions, and public works projects. 
            You can effortlessly track upcoming events, such as town hall meetings, workshops, and public hearings, ensuring you always have the knowledge you need to be an active citizen.
          </p>
        </div>
      </section>

      <section className="landing-section">
        <div className="text-content">
          <h2>Get Involved</h2>
          <p>
            Being an active participant in your community is now easier than ever. 
            LocalGovHub encourages civic engagement by providing you with tools to connect with like-minded individuals, 
            discover volunteer opportunities, and participate in decision-making processes. 
            Learn about initiatives in your area, find local organizations that align with your values, and make a tangible difference in your neighborhood.
          </p>
        </div>
        <img src="bro fist.jpg" alt="Civic engagement" />
      </section>

      {/* Final Paragraph and Buttons */}
      <section className="landing-section call-to-action">
        <div className="text-content">
          <h2>Ready to Make a Difference?</h2>
          <p>
            Join LocalGovHub today and stay informed, engaged, and connected with everything happening in your local community. 
            Start now to take control of the information that matters most to you and play an active role in shaping your neighborhood.
          </p>
        </div>
        <div className="action-buttons">
          {/* Use Link to navigate to the respective pages */}
          <Link to="/signup">
            <button className="button">Sign Up</button> {/* Apply the button class here */}
          </Link>
          <Link to="/login">
            <button className="button">Login</button> {/* Apply the button class here */}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
