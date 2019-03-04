import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import aws_exports from './aws-exports';
import Amplify, { XR } from 'aws-amplify';
import scene_config from './sumerian-exports';
import { withAuthenticator, SumerianScene  } from 'aws-amplify-react';
import AWS from 'aws-sdk';
new AWS.Polly();

 XR.configure({ // XR category configuration
   SumerianProvider: { // Sumerian-specific configuration
     region: 'us-east-1', // Sumerian scene region
     scenes: {
       "en2": {   // Friendly scene name
           sceneConfig: scene_config // Scene JSON configuration
         },
     }
   }
 });

 Amplify.configure(aws_exports);

 class App extends Component {
    render() {
      return (
        <body> {
          <SumerianScene sceneName='en2'/>
               }       </body>
      );
    }
  }

 export default withAuthenticator(App, { includeGreetings: true });