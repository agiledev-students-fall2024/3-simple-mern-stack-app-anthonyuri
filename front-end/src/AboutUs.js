import { useState, useEffect } from 'react';
import axios from 'axios';
import './AboutUs.css'; 

/**
 * A React component for displaying 'About Us' page which fetches the content (texts/imgURL) from the back-end
 * @param {*} param0 an object holding any props passed to this component from its parent component
 * @returns The contents of this component, in JSX form.
 */
const AboutUs = props => {
  const [aboutData, setAboutData] = useState(null); 
  const [error, setError] = useState(''); 
  const [loaded, setLoaded] = useState(false); 

  useEffect(() => {
    //  will fetch data from the backend's /about-us route
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/about-us`)
      .then(response => {
        setAboutData(response.data);
        setLoaded(true);
      })
      .catch(err => {
        setError('Error loading About Us content.');
        console.error(err);
      });
  }, []);

  if (!loaded) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <p className="error">{error}</p>; 
  }


  //will split the text into paragraphs (spliting paragraphs when has double lineBreak present )
  const paragraphs = aboutData.description.split(/\n\n/).map((par, idx) => <p key={idx}>{par}</p>);

  return (
    <div className="AboutUs">
      <h1>{aboutData.title}</h1>
      <img src={aboutData.imageURL} alt="About Us" className="about-img" />
      <p>{paragraphs}</p>
    </div>
  );
};

export default AboutUs;
