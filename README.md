# About this repository

## Project Overview
This repostory will contain all code for our semester long project created during our CMPT 470 - Web Development class.

A lot of beginner programmers seem to face two consistent problems:
1. Setting up a programming environment:
   1. Installing interpreters/compilers
   2. Making sure that their environment matches that of the instructor(students use Windows/Mac while instructor might be using Linux)
   3. Making sure that their assignments are portable(Ex: Code written on Windows but has to run on Linux)
2. Feeling overwhelmed by large blocks of code
   -  Large blocks of code might make beginners nervous and apprehensive about diving into the code. While it is necessary to learn to handle large blocks of code in the long run, beginner programmers can be eased into it by being presented small chunks of code that have been annotated(like a Jupyter Notebook).

For our project, we chose to create a full-stack web application which can be used to aid the learning of programming through interactive tutorials. The application provides [literate programming](https://en.wikipedia.org/wiki/Literate_programming) features and has a user interface similar to Jupyter Notebooks.

Each interactive tutorial can be made up of:
   - Explanatory text written using markdown(with support for LaTex formulas and emojis).
   - Chunks of code which are written by the tutorial author. These chunks of code can then be ran remotely(on the applications server) and the result returned and shown to the reader. Tutorial readers can additionally modify these cells and re-run them in order to understand the code better through experimentation.

### Comparison to alternatives
#### [Jupyter Notebooks](https://jupyter.org/index.html)
##### Pros
- Jupyter Notebooks have support for more languages than our tutorial application.
- Jupyter Notebooks are more popular and have more support/plugins available.
##### Cons
- Jupyter notebooks are extremely popular in various scientific/industrial fields(Data Science, Machine Learning, Physics...) but they require the user to install all necessary interpreters and configure the Jupyter kernel to detect them. Our tutorial application requires no setup for students besides creating an account.
- Jupyter Notebook files require all Jupyter files to be distributed to each user(Dropbox, Github/Gitlab...). Our application provides automatic hosting for every file created. The only barrier to accessing a file is simply having the permission to do so. There is no need to download anything.
- Jupyter Notebook files are difficult to read without using a Jupyter Notebook as the front-end interface. All tutorials for our application are written in plain markdown and can be distributed as raw files if necessary.
#### [repl.it](https://replit.com/)
##### Pros
- `repl.it` has support for more languages than our tutorial application.
- `repl.it` allows users to run full environments where they can install additional libraries.
- `repl.it` has a more attractive/powerful UI/UX.
##### Cons
- `repl.it` can only run interpreted code(Ruby, Python, Javascript...) in "one shot". Each time a project is executed, it is executed from the start to the end. The interpreter used to run the project is closed after the last line of code. Users do not have the ability to run only certain parts of a program over and over again.
- `repl.it` does not provide any way of annotating code outside of comments within the source code or additional files explaining the code. This makes it difficult to annotate and break up a source file into smaller chunks which are easier to understand and digest by students.

## How it works
TODO
## Project File Layout
- `client`: Contains all code for the frontend of the application. The frontend is built using `React` and `Bootstrap`.
- `server`: Contains all code for the backend of our application. The backend is built using `express.js`, `MongoDB` and `node.js`.
  - `containers`: Contains all docker files use to create interpreter environments and isolate each user from all others.
  - `language-servers` Contains all code for each of the language servers which are used to maintain each supported language and its associated interpreter.
  - `models`: Contains all database models.
  - `routes`: Contains all API routes.

## Running the application
TODO

## Authors
- Emily Chen
- Akashdeep Dhami
- Kira Nishi-Beckingham
- Guian Gumpac
- Yavor Konstantinov


