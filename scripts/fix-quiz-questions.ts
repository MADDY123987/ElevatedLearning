import { db } from "../server/db";
import { quizQuestions } from "../shared/schema";

async function addQuizQuestions() {
  console.log("🌱 Adding quiz questions...");
  
  try {
    const existingQuestions = await db.select().from(quizQuestions);
    if (existingQuestions.length > 0) {
      console.log("⏭️ Quiz questions already exist, skipping...");
      return;
    }
    
    // JavaScript Fundamentals Questions (Quiz ID 1)
    await db.insert(quizQuestions).values([
      {
        quizId: 1,
        question: "What is the correct way to declare a variable that cannot be reassigned?",
        optionA: "var x = 10;",
        optionB: "let x = 10;",
        optionC: "const x = 10;",
        optionD: "final x = 10;",
        correctOption: "C"
      },
      {
        quizId: 1,
        question: "Which operator is used for strict equality comparison in JavaScript?",
        optionA: "==",
        optionB: "===",
        optionC: "=",
        optionD: "<==>",
        correctOption: "B"
      },
      {
        quizId: 1,
        question: "What does the 'typeof' operator return for an array?",
        optionA: "'array'",
        optionB: "'object'",
        optionC: "'list'",
        optionD: "'collection'",
        correctOption: "B"
      },
      {
        quizId: 1,
        question: "How do you create a function in JavaScript?",
        optionA: "function myFunction() {}",
        optionB: "def myFunction() {}",
        optionC: "var myFunction = function() {}",
        optionD: "Both A and C",
        correctOption: "D"
      },
      {
        quizId: 1,
        question: "Which method is used to add an element to the end of an array?",
        optionA: "push()",
        optionB: "add()",
        optionC: "append()",
        optionD: "insert()",
        correctOption: "A"
      },
      {
        quizId: 1,
        question: "How do you access the first element of an array named 'myArray'?",
        optionA: "myArray.first",
        optionB: "myArray[0]",
        optionC: "myArray[1]",
        optionD: "myArray.get(0)",
        correctOption: "B"
      },
      {
        quizId: 1,
        question: "What is the result of '2' + 2 in JavaScript?",
        optionA: "22",
        optionB: "4",
        optionC: "'22'",
        optionD: "'4'",
        correctOption: "C"
      },
      {
        quizId: 1,
        question: "Which loop is guaranteed to execute at least once?",
        optionA: "for loop",
        optionB: "while loop",
        optionC: "do...while loop",
        optionD: "forEach loop",
        correctOption: "C"
      },
      {
        quizId: 1,
        question: "What is the correct way to check if a variable is undefined?",
        optionA: "if (x === undefined)",
        optionB: "if (typeof x === 'undefined')",
        optionC: "if (x == null)",
        optionD: "Both A and B",
        correctOption: "D"
      },
      {
        quizId: 1,
        question: "What is the purpose of the 'use strict' directive in JavaScript?",
        optionA: "It enforces stricter parsing and error handling",
        optionB: "It enables new JavaScript features",
        optionC: "It optimizes code performance",
        optionD: "It prevents automatic type conversion",
        correctOption: "A"
      }
    ]);
    
    // Advanced JavaScript Questions (Quiz ID 2)
    await db.insert(quizQuestions).values([
      {
        quizId: 2,
        question: "What is a closure in JavaScript?",
        optionA: "A function that returns another function",
        optionB: "A function that has access to variables in its outer scope",
        optionC: "A function that executes immediately",
        optionD: "A function that can be used as a constructor",
        correctOption: "B"
      },
      {
        quizId: 2,
        question: "What does the 'this' keyword refer to in a regular function?",
        optionA: "The global object",
        optionB: "The object the function is a method of",
        optionC: "The object that called the function",
        optionD: "It depends on how the function is called",
        correctOption: "D"
      },
      {
        quizId: 2,
        question: "What is the purpose of the 'bind' method?",
        optionA: "To attach an event handler",
        optionB: "To copy a function",
        optionC: "To set the 'this' value for a function",
        optionD: "To merge two objects",
        correctOption: "C"
      },
      {
        quizId: 2,
        question: "What is the difference between 'call' and 'apply'?",
        optionA: "They are identical",
        optionB: "'call' takes arguments individually, 'apply' takes an array of arguments",
        optionC: "'call' is for constructor functions, 'apply' is for regular functions",
        optionD: "'call' is synchronous, 'apply' is asynchronous",
        correctOption: "B"
      },
      {
        quizId: 2,
        question: "What is a Promise in JavaScript?",
        optionA: "A proxy for a value not necessarily known at creation time",
        optionB: "A guarantee that a function will execute",
        optionC: "A way to handle errors",
        optionD: "A placeholder for a future value",
        correctOption: "A"
      },
      {
        quizId: 2,
        question: "How do you create a new instance of a constructor function?",
        optionA: "Using the 'instance' keyword",
        optionB: "Using the 'new' keyword",
        optionC: "Using Object.create()",
        optionD: "Using constructor.build()",
        correctOption: "B"
      },
      {
        quizId: 2,
        question: "What is prototype inheritance in JavaScript?",
        optionA: "When a child class inherits from a parent class",
        optionB: "When an object has access to properties and methods of another object",
        optionC: "When a function calls itself",
        optionD: "When an object is cloned from another object",
        correctOption: "B"
      },
      {
        quizId: 2,
        question: "What is the purpose of 'async/await'?",
        optionA: "To make JavaScript code execute faster",
        optionB: "To make asynchronous code look synchronous",
        optionC: "To prevent race conditions",
        optionD: "To replace Promises with callbacks",
        correctOption: "B"
      },
      {
        quizId: 2,
        question: "Which of the following is not a JavaScript design pattern?",
        optionA: "Singleton",
        optionB: "Factory",
        optionC: "Observer",
        optionD: "Interpreter",
        correctOption: "D"
      },
      {
        quizId: 2,
        question: "What is event bubbling in JavaScript?",
        optionA: "When an event on an element triggers the same event on its ancestors",
        optionB: "When an element receives multiple events at once",
        optionC: "When events are queued and processed in a specific order",
        optionD: "When an event is canceled before reaching its target",
        correctOption: "A"
      }
    ]);
    
    // React Questions (Quiz ID 3)
    await db.insert(quizQuestions).values([
      {
        quizId: 3,
        question: "What is a React component?",
        optionA: "A JavaScript class",
        optionB: "A reusable piece of UI",
        optionC: "A data structure",
        optionD: "A method in ReactDOM",
        correctOption: "B"
      },
      {
        quizId: 3,
        question: "How do you pass data to a child component in React?",
        optionA: "Using state",
        optionB: "Using props",
        optionC: "Using context",
        optionD: "Using refs",
        correctOption: "B"
      },
      {
        quizId: 3,
        question: "What are props in React?",
        optionA: "Internal data storage",
        optionB: "Functions that update the UI",
        optionC: "External data passed to components",
        optionD: "React's version of HTML attributes",
        correctOption: "C"
      },
      {
        quizId: 3,
        question: "Can you modify props directly?",
        optionA: "Yes, but only in class components",
        optionB: "Yes, in both class and functional components",
        optionC: "No, props are read-only",
        optionD: "Yes, using setState()",
        correctOption: "C"
      },
      {
        quizId: 3,
        question: "How do you destructure props in a functional component?",
        optionA: "const { propName } = this.props",
        optionB: "const { propName } = props",
        optionC: "const propName = this.props.propName",
        optionD: "const propName = useProps('propName')",
        correctOption: "B"
      },
      {
        quizId: 3,
        question: "What is the correct syntax for a functional component in React?",
        optionA: "function Component() { return <div />; }",
        optionB: "const Component = () => <div />;",
        optionC: "class Component { render() { return <div />; } }",
        optionD: "Both A and B",
        correctOption: "D"
      },
      {
        quizId: 3,
        question: "How can you provide default values for props?",
        optionA: "Component.defaultProps = { propName: value }",
        optionB: "Using the default parameter syntax: (props = {defaultValues})",
        optionC: "<Component default={value} />",
        optionD: "Both A and B",
        correctOption: "D"
      },
      {
        quizId: 3,
        question: "What is prop drilling?",
        optionA: "Passing state down multiple levels of components",
        optionB: "A performance optimization technique",
        optionC: "A way to avoid using Redux",
        optionD: "Using refs to access child DOM nodes",
        correctOption: "A"
      },
      {
        quizId: 3,
        question: "What is the purpose of the key prop when rendering lists?",
        optionA: "To improve performance by helping React identify which items have changed",
        optionB: "To enforce unique CSS styles",
        optionC: "To define the order of components",
        optionD: "To link components with their parent",
        correctOption: "A"
      },
      {
        quizId: 3,
        question: "How do you conditionally render a component in React?",
        optionA: "Using if/else statements directly in JSX",
        optionB: "Using the ternary operator",
        optionC: "Using && operator",
        optionD: "All of the above",
        correctOption: "D"
      }
    ]);
    
    // Node.js Questions (Quiz ID 5)
    await db.insert(quizQuestions).values([
      {
        quizId: 5,
        question: "What is Node.js?",
        optionA: "A web browser",
        optionB: "A JavaScript runtime environment",
        optionC: "A programming language",
        optionD: "A database system",
        correctOption: "B"
      },
      {
        quizId: 5,
        question: "What is the package.json file used for?",
        optionA: "To define project dependencies and metadata",
        optionB: "To store JavaScript code",
        optionC: "To compile JavaScript to machine code",
        optionD: "To configure web servers",
        correctOption: "A"
      },
      {
        quizId: 5,
        question: "How do you import a module in Node.js?",
        optionA: "import module from 'module'",
        optionB: "require('module')",
        optionC: "#include <module>",
        optionD: "using module;",
        correctOption: "B"
      },
      {
        quizId: 5,
        question: "What is the Node.js event loop?",
        optionA: "A CPU scheduling algorithm",
        optionB: "A method for handling asynchronous operations",
        optionC: "A data structure for storing events",
        optionD: "A user interface component",
        correctOption: "B"
      },
      {
        quizId: 5,
        question: "Which of the following is a core module in Node.js?",
        optionA: "express",
        optionB: "react",
        optionC: "fs",
        optionD: "moment",
        correctOption: "C"
      },
      {
        quizId: 5,
        question: "What command is used to initialize a Node.js project?",
        optionA: "node init",
        optionB: "npm init",
        optionC: "node start",
        optionD: "npm create",
        correctOption: "B"
      },
      {
        quizId: 5,
        question: "What does npm stand for?",
        optionA: "Node Package Manager",
        optionB: "New Programming Method",
        optionC: "Node Project Manager",
        optionD: "Node Processing Module",
        correctOption: "A"
      },
      {
        quizId: 5,
        question: "What is middleware in the context of Express.js?",
        optionA: "Software that acts as a bridge between different parts of an application",
        optionB: "Hardware that improves server performance",
        optionC: "A type of database query",
        optionD: "A client-side optimization technique",
        correctOption: "A"
      },
      {
        quizId: 5,
        question: "How do you handle asynchronous operations in Node.js?",
        optionA: "Using callbacks",
        optionB: "Using Promises",
        optionC: "Using async/await",
        optionD: "All of the above",
        correctOption: "D"
      },
      {
        quizId: 5,
        question: "What is the purpose of the 'process' object in Node.js?",
        optionA: "To provide information about the Node.js process",
        optionB: "To create new processes",
        optionC: "To kill processes",
        optionD: "To communicate with the operating system",
        correctOption: "A"
      }
    ]);
    
    // CSS Flexbox and Grid Questions (Quiz ID 8)
    await db.insert(quizQuestions).values([
      {
        quizId: 8,
        question: "What CSS property makes an element a flex container?",
        optionA: "display: flex",
        optionB: "position: flex",
        optionC: "flex: 1",
        optionD: "float: flex",
        correctOption: "A"
      },
      {
        quizId: 8,
        question: "Which property aligns flex items along the main axis?",
        optionA: "justify-content",
        optionB: "align-items",
        optionC: "flex-direction",
        optionD: "flex-wrap",
        correctOption: "A"
      },
      {
        quizId: 8,
        question: "Which property aligns flex items along the cross axis?",
        optionA: "justify-content",
        optionB: "align-items",
        optionC: "flex-flow",
        optionD: "align-self",
        correctOption: "B"
      },
      {
        quizId: 8,
        question: "What is the default value of 'flex-direction'?",
        optionA: "row",
        optionB: "column",
        optionC: "row-reverse",
        optionD: "wrap",
        correctOption: "A"
      },
      {
        quizId: 8,
        question: "Which property is used to wrap flex items onto multiple lines?",
        optionA: "flex-wrap",
        optionB: "flex-flow",
        optionC: "flex-direction",
        optionD: "justify-content",
        correctOption: "A"
      },
      {
        quizId: 8,
        question: "What CSS property makes an element a grid container?",
        optionA: "display: grid",
        optionB: "position: grid",
        optionC: "grid: 1",
        optionD: "layout: grid",
        correctOption: "A"
      },
      {
        quizId: 8,
        question: "How do you define columns in a CSS Grid?",
        optionA: "grid-rows",
        optionB: "grid-template-columns",
        optionC: "column-template",
        optionD: "grid-columns",
        correctOption: "B"
      },
      {
        quizId: 8,
        question: "What is the purpose of 'grid-gap'?",
        optionA: "To set the width of grid columns",
        optionB: "To set the space between grid items",
        optionC: "To overlap grid items",
        optionD: "To create responsive grids",
        correctOption: "B"
      },
      {
        quizId: 8,
        question: "Which value of 'display' creates an inline grid container?",
        optionA: "display: inline-grid",
        optionB: "display: grid-inline",
        optionC: "display: grid inline",
        optionD: "inline: grid",
        correctOption: "A"
      },
      {
        quizId: 8,
        question: "What does 'fr' stand for in CSS Grid?",
        optionA: "fraction",
        optionB: "fragment",
        optionC: "frequency",
        optionD: "free space",
        correctOption: "A"
      }
    ]);
    
    // Add React State Management Questions (Quiz ID 4)
    await db.insert(quizQuestions).values([
      {
        quizId: 4,
        question: "What hook is used for state in functional components?",
        optionA: "useEffect",
        optionB: "useState",
        optionC: "useContext",
        optionD: "useReducer",
        correctOption: "B"
      },
      {
        quizId: 4,
        question: "Which hook is used to perform side effects in functional components?",
        optionA: "useEffect",
        optionB: "useState",
        optionC: "useReducer",
        optionD: "useCallback",
        correctOption: "A"
      },
      {
        quizId: 4,
        question: "What is the Context API used for in React?",
        optionA: "Making API calls",
        optionB: "Sharing state between components without prop drilling",
        optionC: "Creating reusable components",
        optionD: "Managing form inputs",
        correctOption: "B"
      },
      {
        quizId: 4,
        question: "When would you use useReducer instead of useState?",
        optionA: "When state updates are simple",
        optionB: "When you need to pass state to child components",
        optionC: "When state logic is complex or involves multiple sub-values",
        optionD: "When you want to optimize performance of primitive value updates",
        correctOption: "C"
      },
      {
        quizId: 4,
        question: "What is Redux?",
        optionA: "A browser extension for debugging React",
        optionB: "A state management library for JavaScript applications",
        optionC: "A special type of React component",
        optionD: "A styling framework for React",
        correctOption: "B"
      },
      {
        quizId: 4,
        question: "What are the three core principles of Redux?",
        optionA: "Single source of truth, read-only state, changes made with pure functions",
        optionB: "Components, props, state",
        optionC: "Create, read, update, delete",
        optionD: "Model, view, controller",
        correctOption: "A"
      },
      {
        quizId: 4,
        question: "What is the purpose of the useContext hook?",
        optionA: "To create a new context",
        optionB: "To provide values to all children",
        optionC: "To consume values from a context",
        optionD: "To merge multiple contexts",
        correctOption: "C"
      },
      {
        quizId: 4,
        question: "What is a side effect in React?",
        optionA: "A bug in the code",
        optionB: "Operations that affect outside the scope of the current function",
        optionC: "Unnecessary re-renders",
        optionD: "Performance issues in large applications",
        correctOption: "B"
      },
      {
        quizId: 4,
        question: "What is the purpose of the dependency array in useEffect?",
        optionA: "To specify when the effect should run",
        optionB: "To improve performance",
        optionC: "To define what variables the effect needs",
        optionD: "All of the above",
        correctOption: "D"
      },
      {
        quizId: 4,
        question: "What is the purpose of the useMemo hook?",
        optionA: "To memoize expensive functions to avoid unnecessary re-renders",
        optionB: "To manage state in functional components",
        optionC: "To handle form submissions",
        optionD: "To create references to DOM elements",
        correctOption: "A"
      }
    ]);
    
    console.log("✅ Quiz questions added successfully");
  } catch (error) {
    console.error("❌ Error adding quiz questions:", error);
  }
}

addQuizQuestions()
  .catch(console.error)
  .finally(() => process.exit(0));