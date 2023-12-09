# Movies App Project - Garrett Bowman & Sheldon Pasciak

## Technology and Third Party API's used

- Open Movie DataBase - https://www.omdbapi.com/
- Bootstrap - https://getbootstrap.com/
- json-server - https://www.npmjs.com/package/json-server

## Lessons Learned

NOTE: When testing the server with VS Code and Live Web Server, We noticed page reloads after updating to the back end. At first, I though it was because of a flaw in our code, or a missing event.preventDefault. After a good amount of time relooking all the code, a search at Stack Overflow yielded the result. "I got to the bottom of this. It turns out that the problem was due to VS Live Server which was detecting a change in the folder and hot-loading the app. The change was due to the backend, in the same folder, saving a log. Really silly thing to miss..."

### A globally installed npm package can be installed to run a local http web server that doesn't perform with the same reload due to file changes in the structure.

### npm package reference

- https://www.npmjs.com/package/http-server

### how to install globally

- npm install --global http-server

### execute in terminal to server default index.html in current path

- http-server

# Movies App Project Rubric

​

#### Instructions

​
For each project aspect below, a grade of 0, 0.5, or 1 will be assigned. Each aspect represents 10% of the total possible grade.
​

- **0** - mostly incomplete or not present
- **0.5** - partially completed
- **1** - mostly or fully complete
  ​

### Presentation (10%)

​
\_\_\_ both team members speak about their contributions (one team member speaks for both if teammate is absent)
​
​

### Code Quality 30%

​
\_\_\_ code formatted and documented consistently, i.e. use of whitespace and comments

\_\_\_ project is well-organized
​

- external style sheets and scripts only (no inline CSS or JS in HTML file)
- separate folders for scripts, style sheets, and assets
- non-functioning (commented out) code has been removed

\_\_\_ JS best practices followed

- clearly named ids and variable names
- strict mode enabled and code wrapped in IIFE
- code mostly abstracted into smaller functions (under 15 lines)
  ​
  ​

### Output (60%)

​
**_ loading message present when movies are loading
​
_** movies can be added
​
**_ movies can be updated
​
_** movies can be deleted
​
**_ implementation of at least two of the suggested additional features
​
_** project cohesively styled (clean layout, professional-looking UI)
