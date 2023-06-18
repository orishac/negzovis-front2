# KarmaLegoWeb Client

KarmaLegoWeb is a Temporal Data Mining project. Today, to extract Time Interval Related Patterns (TIRPs) from massive data, a researcher is required to use several applications and possess highly technical programming knowledge. KarmaLegoWeb simplify this process into a single web application where every user can upload time-based data, extract unique patterns, analyze it from several different angles using advanced visual tools and share it findings with the world. The client of this project is Dr. Robert Moskovitch and CDALab Laboratory. The project goal is to create an all-in-one time-based data mining platform that presents the use of time-based algorithms in an efficient, simple, fast, and stable way. Our system has been introduced to the laboratory and aid to various studies. The solution chosen is to create a web application that provides a simple and accessible UI to technical aspects of using time-based template mining. By creating the project, we used many technologies such as Python, Flask, React, Apache and more. In the project we faced many challenges, including design and create a server and client-side application, generate a visualization module which can display the algorithm output in interactive way, with this output the user can generate new insights. In addition, we integrated several lab projects (thousands of code lines written in different languages) Into one web app. We achieved all the defined goals and today the system is available at the following link[1]:
https://icc.ise.bgu.ac.il/njsw22

### requirements: Node

### Installation: `npm install`

### Usage: `npm run start`

### Build: `npm run build`

### In production 2 things needs to be changed:

-   package.json: "homepage": "http://127.0.0.1:443/" -> "homepage": "/njsw22/"
-   src/serviceWorker: "homepage": window.base_url = 'http://127.0.0.1:443'; -> window.base_url = '/njsw22';
