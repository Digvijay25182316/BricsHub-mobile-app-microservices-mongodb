const express = require("express");
const connectDB = require("./DB");
const path = require("path");
const User = require("./Schema");

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});

app.post("/", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password,
    });
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>User List</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">

      <h1 style="color: #333;">User Created</h1>
      
      <ul style="list-style: none; padding: 0;display:flex;flex-direction:column;gap:10px">        
              <li style="margin: 10px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 15px; display: inline-block;">${user}</li>
              <a href="/" style="margin: 10px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 15px; display: inline-block;max-width:fit-content">Go Home</a>
      </ul>
    </body>
    </html>`);
  } catch (error) {
    res.send(`<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error</title>
</head>

<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">

  <h1 style="color: #ff0000;">Error</h1>

  <p style="color: #333;">${
    error.code === 11000
      ? "user already exists in the database"
      : error.message || error
  }</p>

  <a href="/" style="margin: 10px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 15px; display: inline-block; text-decoration: none; color: #333;">Go Home</a>

</body>

</html>
`);
  }
});

const deleteUser = async (_id, parentElement) => {
  try {
    const user = await User.findById(_id);
    if (!user) {
      return console.log(`User with ID ${_id} does not exist`);
    }

    await User.findByIdAndDelete(_id);
    console.log(`User with ID ${_id} deleted`);

    // Remove the parent element from the DOM
    if (parentElement) {
      parentElement.remove();
    }
  } catch (error) {
    console.log(error.message || error);
  }
};

app.get("/users", async (req, res) => {
  try {
    const user = await User.find();
    if (!user || user.length === 0) {
      res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User List</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
  
        <h1 style="color: #333;">User List</h1>
        
        <ul style="list-style: none; padding: 0;">
                <li style="margin: 10px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 15px; display: inline-block;">no user to show</li>
                <a href="/" style="margin: 10px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 15px; display: inline-block; text-decoration: none; color: #333;">Go Home</a>
        </ul>
  
      </body>
      </html>`);
      return;
    }
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>User List</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">

      <h1 style="color: #333;">User List</h1>
      
      <ul style="list-style: none; padding: 0;">
        ${user
          .map(
            (user) =>
              `<div key=${user._id}>
              <li style="margin: 10px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 15px; display: inline-block;">${
                user.name
              } - ${user.email}</li>
              <button onclick="${deleteUser(
                user._id,
                this.parentNode
              )}" style="cursor:pointer">
              <svg
          style="height: 25px; width: 25px; color: red"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
        </button>
        </div>`
          )
          .join("")}
      </ul>

    </body>
    </html>
  `);
  } catch (error) {
    res.send(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Error</title>
    </head>
    
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
    
      <h1 style="color: #ff0000;">Error</h1>
    
      <p style="color: #333;">${
        error.code === 11000
          ? "user already exists in the database"
          : error.message || error
      }</p>
    
      <a href="/" style="margin: 10px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 15px; display: inline-block; text-decoration: none; color: #333;">Go Home</a>
    
    </body>
    
    </html>
    `);
  }
});
const PORT = 3000;
app.listen(PORT, (req, res) => {
  console.log(`your server is running on :http://localhost:${PORT}`);
});
