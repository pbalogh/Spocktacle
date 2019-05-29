Here's a live demo:

https://pbalogh.github.io/Spocktacle/

Pick a logic sentence from the dropdown and click one of the two buttons. 

Usually, unless you're solving a 2SAT (or 3SAT!) problem, you'll want the left button, which generates a tableau. 

(Generating a tableau proves your sentence by actually trying to prove the opposite of it -- a kind of "reductio ad absurdum". If every branch in its tree reveals a contradiction -- that is, a requirement that one of the variables must be true even though an earlier branch required it to be false, or vice versa -- then obviously there's no hope for a true resolution. And, if the negation of your sentence is false, your sentence must evaluate to "true.")

Closed branches are marked with black boxes; white boxes indicate a branch that is "open" -- that is, that contain valid children or descendent branches.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

It's made with Create React App, and hasn't been ejected, so all the usual tools and tricks are available to you.

The language is Typescript -- please LMK if there are improvements to be made.

