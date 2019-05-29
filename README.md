 I'm working my way through Graham Priest's "An Introduction to Non-Classical Logics" (loving it!) and decided to post an implementation of tableau solving per his description.

Here's a live demo:

https://pbalogh.github.io/Spocktacle/

Pick a logic sentence from the dropdown and click one of the two buttons. 

Usually, unless you're solving a 2SAT (or 3SAT!) problem, you'll want the left button, which generates a tableau. 

(Generating a tableau proves your sentence by actually trying to prove the opposite of it -- a kind of "reductio ad absurdum". If every branch in its tree reveals a contradiction -- that is, a requirement that one of the variables must be true even though an earlier branch required it to be false, or vice versa -- then obviously there's no hope for a true resolution. And, if the negation of your sentence is false, your sentence must evaluate to "true.")

Or, to put it in common-sense terms:

"Sure, you can find a way for your sentence to be true, but that doesn't mean it's *always* true. The real question is, can you find any way that your sentence is *false*? If so, then we're getting somewhere."

So, to find some way your sentence S is false, we'll set out to prove !S is true.

If we can't do it (that is, if all our branches and attempts lead to internal contradictions like "A is true -- no, wait, A is false") then your sentence is obviously *never* false.

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

