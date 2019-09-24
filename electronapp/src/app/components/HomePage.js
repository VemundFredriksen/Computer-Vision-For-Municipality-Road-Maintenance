import React from 'react';
import DragAndDrop from './DragAndDrop';
import Button from './Button';

import './HomePage.css';

const HomePage = () => (
  <div className="homepage">
    <div className="dnd__container">
      <DragAndDrop />
      <div style={{ margin: '10px' }}>
        <Button text="Feed video" />
      </div>
    </div>
  </div>
);

export default HomePage;
