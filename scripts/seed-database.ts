import { db } from "../server/db";
import { 
  badges, 
  courses, 
  liveSessions, 
  quizzes, 
  quizQuestions,
  compilerChallenges,
  users
} from "../shared/schema";
import { compare, hash } from "bcrypt";
import { format, addDays } from "date-fns";

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  // Add users if they don't exist
  const usersExist = await db.select().from(users);
  if (usersExist.length === 0) {
    console.log("Adding default users...");
    
    // Create hashed passwords
    const hashedPassword1 = await hash("password123", 10);
    const hashedPassword2 = await hash("password123", 10);
    
    await db.insert(users).values([
      {
        username: "Madhavan",
        password: hashedPassword1,
        email: "madhavan@example.com",
        avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
        xp: 120,
        createdAt: new Date()
      },
      {
        username: "Elevated",
        password: hashedPassword2,
        email: "elevated@example.com",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        xp: 450,
        createdAt: new Date()
      }
    ]);
  }

  // Add badges if they don't exist
  const badgesExist = await db.select().from(badges);
  if (badgesExist.length === 0) {
    console.log("Adding badges...");
    
    await db.insert(badges).values([
      {
        name: "Course Explorer",
        description: "Enrolled in your first course",
        iconUrl: "https://cdn-icons-png.flaticon.com/512/2072/2072130.png",
        requirement: "enroll:1",
        createdAt: new Date()
      },
      {
        name: "Quiz Master",
        description: "Scored 100% on a quiz",
        iconUrl: "https://cdn-icons-png.flaticon.com/512/3227/3227076.png",
        requirement: "quiz:perfect",
        createdAt: new Date()
      },
      {
        name: "Code Ninja",
        description: "Completed 3 coding challenges",
        iconUrl: "https://cdn-icons-png.flaticon.com/512/6614/6614677.png",
        requirement: "compiler:3",
        createdAt: new Date()
      },
      {
        name: "Committed Learner",
        description: "Logged in for 5 consecutive days",
        iconUrl: "https://cdn-icons-png.flaticon.com/512/3112/3112946.png",
        requirement: "login:5",
        createdAt: new Date()
      },
      {
        name: "Fast Learner",
        description: "Completed a course in less than a week",
        iconUrl: "https://cdn-icons-png.flaticon.com/512/1378/1378640.png",
        requirement: "course:fast",
        createdAt: new Date()
      }
    ]);
  }

  // Add courses if they don't exist
  const coursesExist = await db.select().from(courses);
  if (coursesExist.length === 0) {
    console.log("Adding courses...");
    
    await db.insert(courses).values([
      {
        title: "Complete JavaScript Basics to Advanced",
        description: "Learn JavaScript from scratch and progress to advanced concepts like closures, promises, and async/await.",
        category: "Programming",
        thumbnailUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
        rating: 4.8,
        lessonsCount: 48,
        xpReward: 150,
        createdAt: new Date()
      },
      {
        title: "React Framework Masterclass",
        description: "Become a React expert with this comprehensive guide to building modern web applications with React.",
        category: "Web Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
        rating: 4.9,
        lessonsCount: 36,
        xpReward: 200,
        createdAt: new Date()
      },
      {
        title: "Node.js Back-End Development",
        description: "Build scalable back-end applications with Node.js, Express, and MongoDB.",
        category: "Backend",
        thumbnailUrl: "https://images.unsplash.com/photo-1616763355548-1b606f439f86",
        rating: 4.7,
        lessonsCount: 42,
        xpReward: 180,
        createdAt: new Date()
      },
      {
        title: "Python for Data Science",
        description: "Master data analysis, visualization and machine learning with Python, NumPy, Pandas and Scikit-learn.",
        category: "Data Science",
        thumbnailUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935",
        rating: 4.9,
        lessonsCount: 56,
        xpReward: 220,
        createdAt: new Date()
      },
      {
        title: "Mobile App Development with React Native",
        description: "Create cross-platform mobile applications for iOS and Android using your React knowledge.",
        category: "Mobile Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1581276879432-15e50529f34b",
        rating: 4.6,
        lessonsCount: 38,
        xpReward: 190,
        createdAt: new Date()
      },
      {
        title: "Modern CSS and SASS",
        description: "Level up your styling skills with modern CSS techniques, Flexbox, Grid, and SASS preprocessing.",
        category: "Web Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2",
        rating: 4.7,
        lessonsCount: 32,
        xpReward: 140,
        createdAt: new Date()
      },
      {
        title: "Docker and Kubernetes for Deployment",
        description: "Learn to containerize your applications and orchestrate them for production environments.",
        category: "DevOps",
        thumbnailUrl: "https://images.unsplash.com/photo-1605745341489-5b14b6db7ecf",
        rating: 4.8,
        lessonsCount: 28,
        xpReward: 170,
        createdAt: new Date()
      },
      {
        title: "Full-Stack TypeScript Development",
        description: "Build type-safe applications from front-end to back-end using TypeScript, React, and Node.js.",
        category: "Programming",
        thumbnailUrl: "https://images.unsplash.com/photo-1581276879432-15e50529f34b",
        rating: 4.9,
        lessonsCount: 54,
        xpReward: 210,
        createdAt: new Date()
      },
      {
        title: "GraphQL API Development",
        description: "Design efficient APIs with GraphQL, Apollo Server, and integrate with various databases.",
        category: "Backend",
        thumbnailUrl: "https://images.unsplash.com/photo-1555952494-efd681c7e3f9",
        rating: 4.7,
        lessonsCount: 26,
        xpReward: 160,
        createdAt: new Date()
      },
      {
        title: "Next.js for Production Applications",
        description: "Build SEO-friendly, server-side rendered React applications with Next.js.",
        category: "Web Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356",
        rating: 4.8,
        lessonsCount: 34,
        xpReward: 180,
        createdAt: new Date()
      },
      {
        title: "Web Accessibility (WCAG) Guidelines",
        description: "Make your web applications accessible to everyone by following best practices and standards.",
        category: "Web Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1584697964190-7383c10c7e5a",
        rating: 4.6,
        lessonsCount: 24,
        xpReward: 130,
        createdAt: new Date()
      },
      {
        title: "CI/CD Pipeline Setup",
        description: "Automate your testing and deployment processes with GitHub Actions, Jenkins, and other tools.",
        category: "DevOps",
        thumbnailUrl: "https://images.unsplash.com/photo-1618044733300-9472054094ee",
        rating: 4.7,
        lessonsCount: 22,
        xpReward: 150,
        createdAt: new Date()
      },
      {
        title: "Cloud Computing with AWS",
        description: "Deploy and scale your applications using Amazon Web Services infrastructure.",
        category: "Cloud",
        thumbnailUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8",
        rating: 4.8,
        lessonsCount: 40,
        xpReward: 190,
        createdAt: new Date()
      },
      {
        title: "Vue.js Framework Complete Course",
        description: "Learn the progressive JavaScript framework for building user interfaces and single-page applications.",
        category: "Web Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1537984822441-cff330075342",
        rating: 4.7,
        lessonsCount: 38,
        xpReward: 170,
        createdAt: new Date()
      },
      {
        title: "Testing JavaScript Applications",
        description: "Master unit, integration, and end-to-end testing with Jest, React Testing Library, and Cypress.",
        category: "Programming",
        thumbnailUrl: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2",
        rating: 4.6,
        lessonsCount: 30,
        xpReward: 160,
        createdAt: new Date()
      },
      {
        title: "Blockchain Development Fundamentals",
        description: "Understand the fundamentals of blockchain technology and build decentralized applications.",
        category: "Blockchain",
        thumbnailUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55",
        rating: 4.7,
        lessonsCount: 36,
        xpReward: 200,
        createdAt: new Date()
      },
      {
        title: "UI/UX Design Principles",
        description: "Learn the principles of good user interface and user experience design for digital products.",
        category: "Design",
        thumbnailUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e",
        rating: 4.8,
        lessonsCount: 28,
        xpReward: 150,
        createdAt: new Date()
      },
      {
        title: "Progressive Web Apps (PWA)",
        description: "Convert your web applications into installable, offline-capable progressive web apps.",
        category: "Web Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766",
        rating: 4.6,
        lessonsCount: 26,
        xpReward: 140,
        createdAt: new Date()
      },
      {
        title: "Machine Learning with TensorFlow",
        description: "Build and train machine learning models using TensorFlow and deploy them to production.",
        category: "Data Science",
        thumbnailUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
        rating: 4.9,
        lessonsCount: 50,
        xpReward: 230,
        createdAt: new Date()
      },
      {
        title: "Cybersecurity for Developers",
        description: "Learn to identify and fix common security vulnerabilities in web applications.",
        category: "Security",
        thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
        rating: 4.8,
        lessonsCount: 32,
        xpReward: 180,
        createdAt: new Date()
      }
    ]);
  }

  // Add live sessions if they don't exist
  const sessionsExist = await db.select().from(liveSessions);
  if (sessionsExist.length === 0) {
    console.log("Adding live sessions...");
    
    const tomorrow = addDays(new Date(), 1);
    const dayAfterTomorrow = addDays(new Date(), 2);
    const threeDaysFromNow = addDays(new Date(), 3);
    const fourDaysFromNow = addDays(new Date(), 4);
    
    await db.insert(liveSessions).values([
      {
        title: "JavaScript ES6+ Features Deep Dive",
        description: "Explore the modern features of JavaScript ES6 and beyond that make coding more efficient.",
        instructorName: "Elevated",
        duration: 60,
        sessionDate: tomorrow,
        meetingId: "123456789",
        meetingPassword: "123456"
      },
      {
        title: "React Hooks Workshop",
        description: "Hands-on workshop about React Hooks and how to refactor class components to functional components.",
        instructorName: "Madhavan",
        duration: 90,
        sessionDate: dayAfterTomorrow,
        meetingId: "987654321",
        meetingPassword: "654321"
      },
      {
        title: "Responsive Design Masterclass",
        description: "Learn to create fully responsive websites that work on any device using modern CSS techniques.",
        instructorName: "Elevated",
        duration: 75,
        sessionDate: threeDaysFromNow,
        meetingId: "567891234",
        meetingPassword: "567891"
      },
      {
        title: "Database Design and Optimization",
        description: "Best practices for designing efficient database schemas and optimizing queries for performance.",
        instructorName: "Madhavan",
        duration: 120,
        sessionDate: fourDaysFromNow,
        meetingId: "432156789",
        meetingPassword: "432156"
      }
    ]);
  }

  // Add quizzes if they don't exist
  const quizzesExist = await db.select().from(quizzes);
  if (quizzesExist.length === 0) {
    console.log("Adding quizzes...");
    
    // First add the quizzes
    const quizzesData = [
      {
        title: "JavaScript Fundamentals",
        description: "Test your knowledge of JavaScript basics including variables, functions, and control flow.",
        xpReward: 25,
        courseId: 1,
        difficultyLevel: "Beginner",
        createdAt: new Date()
      },
      {
        title: "Advanced JavaScript Concepts",
        description: "Test your understanding of closures, prototypes, and asynchronous JavaScript.",
        xpReward: 40,
        courseId: 1,
        difficultyLevel: "Advanced",
        createdAt: new Date()
      },
      {
        title: "React Components and Props",
        description: "Quiz covering React component architecture and the proper use of props.",
        xpReward: 30,
        courseId: 2,
        difficultyLevel: "Intermediate",
        createdAt: new Date()
      },
      {
        title: "React State Management",
        description: "Test your knowledge of state management in React using hooks and context.",
        xpReward: 35,
        courseId: 2,
        difficultyLevel: "Intermediate",
        createdAt: new Date()
      },
      {
        title: "Node.js Basics",
        description: "Fundamental concepts of Node.js including modules, npm, and the event loop.",
        xpReward: 25,
        courseId: 3,
        difficultyLevel: "Beginner",
        createdAt: new Date()
      },
      {
        title: "Express.js Middleware and Routing",
        description: "Quiz on Express.js middleware concepts and route configuration.",
        xpReward: 30,
        courseId: 3,
        difficultyLevel: "Intermediate",
        createdAt: new Date()
      },
      {
        title: "Python Syntax and Data Structures",
        description: "Test your knowledge of Python syntax, lists, dictionaries, and other data structures.",
        xpReward: 25,
        courseId: 4,
        difficultyLevel: "Beginner",
        createdAt: new Date()
      },
      {
        title: "CSS Flexbox and Grid",
        description: "Quiz covering modern CSS layout techniques using Flexbox and Grid.",
        xpReward: 25,
        courseId: 6,
        difficultyLevel: "Beginner",
        createdAt: new Date()
      }
    ];
    
    const insertedQuizzes = await db.insert(quizzes).values(quizzesData).returning();
    
    // Now add questions for each quiz
    const questionsData = [];
    
    // Questions for JavaScript Fundamentals
    for (let i = 0; i < 10; i++) {
      questionsData.push({
        quizId: insertedQuizzes[0].id,
        questionText: [
          "What is the correct way to declare a variable that cannot be reassigned?",
          "Which operator is used for strict equality comparison in JavaScript?",
          "What does the 'typeof' operator return for an array?",
          "How do you create a function in JavaScript?",
          "Which method is used to add an element to the end of an array?",
          "How do you access the first element of an array named 'myArray'?",
          "What is the result of '2' + 2 in JavaScript?",
          "Which loop is guaranteed to execute at least once?",
          "What is the correct way to check if a variable is undefined?",
          "What is the purpose of the 'use strict' directive in JavaScript?"
        ][i],
        options: JSON.stringify([
          ["var x = 10;", "let x = 10;", "const x = 10;", "final x = 10;"],
          ["==", "===", "=", "<==>"],
          ["'array'", "'object'", "'list'", "'collection'"],
          ["function myFunction() {}", "def myFunction() {}", "var myFunction = function() {}", "Both A and C"],
          ["push()", "add()", "append()", "insert()"],
          ["myArray.first", "myArray[0]", "myArray[1]", "myArray.get(0)"],
          ["22", "4", "'22'", "'4'"],
          ["for loop", "while loop", "do...while loop", "forEach loop"],
          ["if (x === undefined)", "if (typeof x === 'undefined')", "if (x == null)", "Both A and B"],
          ["It enforces stricter parsing and error handling", "It enables new JavaScript features", "It optimizes code performance", "It prevents automatic type conversion"]
        ][i]),
        correctAnswer: [2, 1, 1, 3, 0, 1, 2, 2, 3, 0][i],
        createdAt: new Date()
      });
    }
    
    // Questions for Advanced JavaScript Concepts
    for (let i = 0; i < 10; i++) {
      questionsData.push({
        quizId: insertedQuizzes[1].id,
        questionText: [
          "What is a closure in JavaScript?",
          "What does the 'this' keyword refer to in a regular function?",
          "What is the purpose of the 'bind' method?",
          "What is the difference between 'call' and 'apply'?",
          "What is a Promise in JavaScript?",
          "How do you create a new instance of a constructor function?",
          "What is prototype inheritance in JavaScript?",
          "What is the purpose of 'async/await'?",
          "Which of the following is not a JavaScript design pattern?",
          "What is event bubbling in JavaScript?"
        ][i],
        options: JSON.stringify([
          ["A function that returns another function", "A function that has access to variables in its outer scope", "A function that executes immediately", "A function that can be used as a constructor"],
          ["The global object", "The object the function is a method of", "The object that called the function", "It depends on how the function is called"],
          ["To attach an event handler", "To copy a function", "To set the 'this' value for a function", "To merge two objects"],
          ["They are identical", "'call' takes arguments individually, 'apply' takes an array of arguments", "'call' is for constructor functions, 'apply' is for regular functions", "'call' is synchronous, 'apply' is asynchronous"],
          ["A proxy for a value not necessarily known at creation time", "A guarantee that a function will execute", "A way to handle errors", "A placeholder for a future value"],
          ["Using the 'instance' keyword", "Using the 'new' keyword", "Using Object.create()", "Using constructor.build()"],
          ["When a child class inherits from a parent class", "When an object has access to properties and methods of another object", "When a function calls itself", "When an object is cloned from another object"],
          ["To make JavaScript code execute faster", "To make asynchronous code look synchronous", "To prevent race conditions", "To replace Promises with callbacks"],
          ["Singleton", "Factory", "Observer", "Interpreter"],
          ["When an event on an element triggers the same event on its ancestors", "When an element receives multiple events at once", "When events are queued and processed in a specific order", "When an event is canceled before reaching its target"]
        ][i]),
        correctAnswer: [1, 3, 2, 1, 0, 1, 1, 1, 3, 0][i],
        createdAt: new Date()
      });
    }
    
    // Questions for React Components and Props
    for (let i = 0; i < 10; i++) {
      questionsData.push({
        quizId: insertedQuizzes[2].id,
        questionText: [
          "What is a React component?",
          "How do you pass data to a child component in React?",
          "What are props in React?",
          "Can you modify props directly?",
          "How do you destructure props in a functional component?",
          "What is the correct syntax for a functional component in React?",
          "How can you provide default values for props?",
          "What is prop drilling?",
          "What is the purpose of the key prop when rendering lists?",
          "How do you conditionally render a component in React?"
        ][i],
        options: JSON.stringify([
          ["A JavaScript class", "A reusable piece of UI", "A data structure", "A method in ReactDOM"],
          ["Using state", "Using props", "Using context", "Using refs"],
          ["Internal data storage", "Functions that update the UI", "External data passed to components", "React's version of HTML attributes"],
          ["Yes, but only in class components", "Yes, in both class and functional components", "No, props are read-only", "Yes, using setState()"],
          ["const { propName } = this.props", "const { propName } = props", "const propName = this.props.propName", "const propName = useProps('propName')"],
          ["function Component() { return <div />; }", "const Component = () => <div />;", "class Component { render() { return <div />; } }", "Both A and B"],
          ["Component.defaultProps = { propName: value }", "Using the default parameter syntax: (props = {defaultValues})", "<Component default={value} />", "Both A and B"],
          ["Passing state down multiple levels of components", "A performance optimization technique", "A way to avoid using Redux", "Using refs to access child DOM nodes"],
          ["To improve performance by helping React identify which items have changed", "To enforce unique CSS styles", "To define the order of components", "To link components with their parent"],
          ["Using if/else statements directly in JSX", "Using the ternary operator", "Using && operator", "All of the above"]
        ][i]),
        correctAnswer: [1, 1, 2, 2, 1, 3, 3, 0, 0, 3][i],
        createdAt: new Date()
      });
    }
    
    // Questions for Node.js Basics
    for (let i = 0; i < 10; i++) {
      questionsData.push({
        quizId: insertedQuizzes[4].id,
        questionText: [
          "What is Node.js?",
          "What is the package.json file used for?",
          "How do you import a module in Node.js?",
          "What is the Node.js event loop?",
          "Which of the following is a core module in Node.js?",
          "What command is used to initialize a Node.js project?",
          "What does npm stand for?",
          "What is middleware in the context of Express.js?",
          "How do you handle asynchronous operations in Node.js?",
          "What is the purpose of the 'process' object in Node.js?"
        ][i],
        options: JSON.stringify([
          ["A web browser", "A JavaScript runtime environment", "A programming language", "A database system"],
          ["To define project dependencies and metadata", "To store JavaScript code", "To compile JavaScript to machine code", "To configure web servers"],
          ["import module from 'module'", "require('module')", "#include <module>", "using module;"],
          ["A CPU scheduling algorithm", "A method for handling asynchronous operations", "A data structure for storing events", "A user interface component"],
          ["express", "react", "fs", "moment"],
          ["node init", "npm init", "node start", "npm create"],
          ["Node Package Manager", "New Programming Method", "Node Project Manager", "Node Processing Module"],
          ["Software that acts as a bridge between different parts of an application", "Hardware that improves server performance", "A type of database query", "A client-side optimization technique"],
          ["Using callbacks", "Using Promises", "Using async/await", "All of the above"],
          ["To provide information about the Node.js process", "To create new processes", "To kill processes", "To communicate with the operating system"]
        ][i]),
        correctAnswer: [1, 0, 1, 1, 2, 1, 0, 0, 3, 0][i],
        createdAt: new Date()
      });
    }
    
    // I'll add 10 questions for CSS Flexbox and Grid as well
    for (let i = 0; i < 10; i++) {
      questionsData.push({
        quizId: insertedQuizzes[7].id,
        questionText: [
          "What CSS property makes an element a flex container?",
          "Which property aligns flex items along the main axis?",
          "Which property aligns flex items along the cross axis?",
          "What is the default value of 'flex-direction'?",
          "Which property is used to wrap flex items onto multiple lines?",
          "What CSS property makes an element a grid container?",
          "How do you define columns in a CSS Grid?",
          "What is the purpose of 'grid-gap'?",
          "Which value of 'display' creates an inline grid container?",
          "What does 'fr' stand for in CSS Grid?"
        ][i],
        options: JSON.stringify([
          ["display: flex", "position: flex", "flex: 1", "float: flex"],
          ["justify-content", "align-items", "flex-direction", "flex-wrap"],
          ["justify-content", "align-items", "flex-flow", "align-self"],
          ["row", "column", "row-reverse", "wrap"],
          ["flex-wrap", "flex-flow", "flex-direction", "justify-content"],
          ["display: grid", "position: grid", "grid: 1", "layout: grid"],
          ["grid-rows", "grid-template-columns", "column-template", "grid-columns"],
          ["To set the width of grid columns", "To set the space between grid items", "To overlap grid items", "To create responsive grids"],
          ["display: inline-grid", "display: grid-inline", "display: grid inline", "inline: grid"],
          ["fraction", "fragment", "frequency", "free space"]
        ][i]),
        correctAnswer: [0, 0, 1, 0, 0, 0, 1, 1, 0, 0][i],
        createdAt: new Date()
      });
    }
    
    await db.insert(quizQuestions).values(questionsData);
  }

  // Add compiler challenges if they don't exist
  const challengesExist = await db.select().from(compilerChallenges);
  if (challengesExist.length === 0) {
    console.log("Adding compiler challenges...");
    
    await db.insert(compilerChallenges).values([
      {
        title: "Hello World",
        description: "Write a function that returns the string 'Hello, World!'",
        quizId: 1,
        instructions: "Create a function called 'helloWorld' that returns the string 'Hello, World!'",
        startingCode: "function helloWorld() {\n  // Your code here\n}\n\n// Don't modify below this line\nconsole.log(helloWorld());",
        expectedOutput: "Hello, World!",
        difficulty: "Beginner",
        language: "javascript",
        createdAt: new Date()
      },
      {
        title: "Sum of Two Numbers",
        description: "Write a function that returns the sum of two numbers",
        quizId: 1,
        instructions: "Create a function called 'sum' that takes two parameters and returns their sum",
        startingCode: "function sum(a, b) {\n  // Your code here\n}\n\n// Don't modify below this line\nconsole.log(sum(5, 3));",
        expectedOutput: "8",
        difficulty: "Beginner",
        language: "javascript",
        createdAt: new Date()
      },
      {
        title: "Check Even Number",
        description: "Write a function that checks if a number is even",
        quizId: 1,
        instructions: "Create a function called 'isEven' that takes a number and returns true if it's even, false otherwise",
        startingCode: "function isEven(num) {\n  // Your code here\n}\n\n// Don't modify below this line\nconsole.log(isEven(4));",
        expectedOutput: "true",
        difficulty: "Beginner",
        language: "javascript",
        createdAt: new Date()
      },
      {
        title: "Reverse a String",
        description: "Write a function that reverses a string",
        quizId: 1,
        instructions: "Create a function called 'reverseString' that takes a string and returns it reversed",
        startingCode: "function reverseString(str) {\n  // Your code here\n}\n\n// Don't modify below this line\nconsole.log(reverseString('hello'));",
        expectedOutput: "olleh",
        difficulty: "Beginner",
        language: "javascript",
        createdAt: new Date()
      },
      {
        title: "Find the Largest Number",
        description: "Write a function that finds the largest number in an array",
        quizId: 2,
        instructions: "Create a function called 'findLargest' that takes an array of numbers and returns the largest one",
        startingCode: "function findLargest(arr) {\n  // Your code here\n}\n\n// Don't modify below this line\nconsole.log(findLargest([5, 12, 8, 1, 23, 7]));",
        expectedOutput: "23",
        difficulty: "Intermediate",
        language: "javascript",
        createdAt: new Date()
      },
      {
        title: "Count Vowels",
        description: "Write a function that counts the number of vowels in a string",
        quizId: 3,
        instructions: "Create a function called 'countVowels' that takes a string and returns the number of vowels (a, e, i, o, u) it contains",
        startingCode: "function countVowels(str) {\n  // Your code here\n}\n\n// Don't modify below this line\nconsole.log(countVowels('hello world'));",
        expectedOutput: "3",
        difficulty: "Intermediate",
        language: "javascript",
        createdAt: new Date()
      },
      {
        title: "Factorial",
        description: "Write a function that calculates the factorial of a number",
        quizId: 4,
        instructions: "Create a function called 'factorial' that takes a number and returns its factorial",
        startingCode: "function factorial(n) {\n  // Your code here\n}\n\n// Don't modify below this line\nconsole.log(factorial(5));",
        expectedOutput: "120",
        difficulty: "Intermediate",
        language: "javascript",
        createdAt: new Date()
      },
      {
        title: "FizzBuzz",
        description: "Implement the classic FizzBuzz problem",
        quizId: 5,
        instructions: "Create a function called 'fizzBuzz' that takes a number and returns 'Fizz' if the number is divisible by 3, 'Buzz' if divisible by 5, 'FizzBuzz' if divisible by both, or the number itself otherwise",
        startingCode: "function fizzBuzz(num) {\n  // Your code here\n}\n\n// Don't modify below this line\nconsole.log(fizzBuzz(15));",
        expectedOutput: "FizzBuzz",
        difficulty: "Intermediate",
        language: "javascript",
        createdAt: new Date()
      }
    ]);
  }

  console.log("✅ Database seeding completed!");
}

seedDatabase()
  .catch(console.error)
  .finally(() => process.exit(0));