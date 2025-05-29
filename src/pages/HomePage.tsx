import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Property Listing App</h1>
      <nav>
        <ul>
          <li>
            <Link to="/search-property">Search Properties</Link>
          </li>
          <li>
            <Link to="/liked-property">Liked Properties</Link>
          </li>
          <li>
            <Link to="/property-recommended">Property Recommendations</Link>
          </li>
          <li>
            <Link to="/my-listed-properties">My Listed Properties</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage; 