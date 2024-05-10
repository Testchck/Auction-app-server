const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
// Increase the limit to handle larger payloads
app.use(bodyParser.json({ limit: '100000mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ extended: true, limit: '5000mb' }));


// //import Models
const teamModel = require('./models/teamModel');
const playerModel = require('./models/playerModel');
const userModel = require('./models/userModel');
const tempModel = require('./models/tempModel');

//mongoDB Connection
mongoose.connect('mongodb+srv://anas:anas@cluster0.gxxnckg.mongodb.net/bidd-app?retryWrites=true&w=majority&appName=Cluster0');

mongoose.connection.on('connected', () => {
  console.log('MongoDb connection successfully connected....');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

//team register route
app.post('/api/team/register', async (req, res) => {
  const teamDetails = {
    Team_name: req.body.teamname,
    Place: req.body.place,
    Phone: req.body.phone,
    Team_manager: req.body.teammanager,
    Wallet: 100000
  }
  teamModel.create(teamDetails)
    .then(teamDetails => {
      console.log('New Team Added Successfully');
      res.status(200).json({ message: 'Team register successfully' });
    }).catch(err => {
      console.log(err);
      res.json(err);
    })
})


// Define a route to fetch data from the database
app.get('/api/data', async (req, res) => {
  try {
    const data = await teamModel.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// API endpoint to delete team by ID
app.delete('/api/team/:id', async (req, res) => {
  try {
    const team = await teamModel.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(team.Team_name);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

//Route of Player Register
app.post('/api/player/register', async (req, res) => {
  // console.log("APi Running Successfully");
  // res.json("api load successfully");
  const PlayerDetails = {
    Player_Name: req.body.playername,
    Player_Description: req.body.playerdescription,
    Player_Position: req.body.playerpos,
    Player_Price: req.body.playerprice,
    Player_Image: req.body.playerimage,
    Owner_Name: "No Owner Name"
  }

  try {
    const player = await tempModel.create(PlayerDetails);
    console.log('New Player Added Successfully');
    res.status(200).json({ message: 'Player register successfully' });
  } catch (e) {
    console.log(e)
  }
})

//fetch the details of players
app.get('/api/player/data', async (req, res) => {
  try {
    const playerdata = await tempModel.find();
    res.json(playerdata);
  } catch (e) {
    res.json(err)
  }
})


//fetch all players details and list it
app.get('/api/all/player/data', async (req, res) => {
  try {
    const playerdata = await playerModel.find();
    res.json(playerdata);
  } catch (e) {
    res.json(err)
  }
})


//fetch the details of Teams
app.get('/api/team/data', async (req, res) => {
  try {
    const teamData = await teamModel.find();
    res.json(teamData);
  } catch (e) {
    res.json(e)
  }
})

// API endpoint to delete team by ID
app.delete('/api/player/:id', async (req, res) => {
  try {
    const player = await playerModel.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(team.Player_Name);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


//update player price
app.put('/api/updatePlayerPrice/:playername', async (req, res) => {
  try {
    const { playername } = req.params;
    const { newPrice, teamName } = req.body;

    const playerToUpdate = await tempModel.findOneAndUpdate(
      { Player_Name: playername },
      { $set: { Player_Price: newPrice, Owner_Name: teamName } },
      { new: true }
    );
    return res.status(200).json(playerToUpdate);
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: 'Server error' });
  }
});


//fetch the Specific user Data
app.get('/api/playerDetails/:id', async (req, res) => {
  try {
    const intividualPlayers = await playerModel.findById(req.params.id);
    if (!intividualPlayers) {
      console.log('Data Not Found')
      res.json({ error: 'Data Not Found' })
    }
    // console.log(intividualPlayers);
    res.json(intividualPlayers);
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: 'Server error' });
  }
})

//for wallet update
app.put('/api/wallet/update/:teamName', async (req, res) => {
  const { teamName } = req.params;
  const { walletupdate } = req.body;
  console.log(teamName, walletupdate)
  try {
    const teams = await teamModel.findOne({ Team_name: teamName });
    if (!teams) {
      // No team found with the specified name
      console.log("Team not found");
      return res.status(404).json({ message: "Team not found" });
    }
    if (teams.Wallet === 0) {
      console.log("Wallet is empty")
      return res.json({ message: "Wallet is empty" });
    }
    const fetchValue = teams.Wallet;
    console.log(fetchValue);
    const updateWalletValue = fetchValue - walletupdate;
    console.log(updateWalletValue);
    const teamToUpdate = await teamModel.findOneAndUpdate(
      { Team_name: teamName },
      { $set: { Wallet: updateWalletValue } },
      { new: true }
    );
    res.json({ message: 'Team Wallet updated successfully', updatedTeam: teamToUpdate });
    console.log("Team Wallet updated successfully", teamToUpdate);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
})

//user registration
app.post('/api/user/register', async (req, res) => {
  const userReg = {
    User_Name: req.body.username,
    User_Email: req.body.useremail,
    User_Password: req.body.userpassword,
    User_ConfirmPassword: req.body.userconfirmpassword
  }
  const user = await userModel.findOne({ User_Email: req.body.useremail });
  if (user)
    return res.status(200).json({ message: "User already exist" });
  try {
    const user = await userModel.create(userReg);
    console.log('New User Added Successfully');
    res.status(200).json({ message: 'User register successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})


//loginRoute
app.post('/api/login', async (req, res) => {
  const {
    email,
    password
  } = req.body;

  const adminLogin = {
    AdminUserName: 'admin@app.com',
    AdminPassword: 'password@admin'
  }

  try {
    const user = await userModel.findOne({ User_Email: email });
    if (!user)
      return res.status(401).send({ message: "User doesn't exist" });
    if (email === adminLogin.AdminUserName && password === adminLogin.AdminPassword) {
      res.status(200).json({ message: 'Admin Login Successfully' });
      console.log("Admin Login Successfully");
    }
    else if (user.User_Password === password) {
      console.log("Login Successfully");
      res.status(200).json({ message: 'User Login Successfully' });
    } else {
      console.log("Check Your UserName or Password");
      res.status(200).json({ message: 'Check Your UserName or Password' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get details fetch
app.get('/api/users/:email', async (req, res) => {
  try {
    const { email } = req.params
    const user = await userModel.findOne({ User_Email: email });
    if (!user) {
      console.log('Data Not Found')
      res.json({ error: 'Data Not Found' })
    } else {
      const users = {
        username: user.User_Name,
        useremail: user.User_Email
      }
      res.json({ users });
      console.log(users);
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: 'Server error' });
  }
})

//final bidd
app.post('/api/final/bidd', async (req, res) => {
  try {
    const { teamName, newPrice, playerName } = req.body;
    const tempPlayer = await tempModel.findOne({ Player_Name: playerName });

    if (!tempPlayer) {
      console.log('Player not found');
      return res.status(404).json({ error: 'Player not found' });
    }

    const playerFinalData = {
      Player_Name: tempPlayer.Player_Name,
      Player_Description: tempPlayer.Player_Description,
      Player_Position: tempPlayer.Player_Position,
      Player_Price: newPrice,
      Player_Image: tempPlayer.Player_Image,
      Owner_Name: teamName
    };

    const playerFinal = await playerModel.create(playerFinalData);

    if (!playerFinal) {
      console.log('Data Not Found');
      return res.status(404).json({ error: 'Data Not Found' });
    } else {
      // Delete the temporary player
      const deleteTemp = await tempModel.deleteOne({ Player_Name: playerName });
      if (!deleteTemp) {
        console.log('Data Not Found');
        return res.status(404).json({ error: 'Data Not Found' });
      } else {
        const walletUpdate = await teamModel.findOne({ Team_name: teamName })
        if (walletUpdate) {
          const updateWalletValue = walletUpdate.Wallet - newPrice;
          const teamToUpdate = await teamModel.findOneAndUpdate(
            { Team_name: teamName },
            { $set: { Wallet: updateWalletValue } },
            { new: true }
          );
        }
        return res.json({ message: "Final Bidd successfully Completed..." })
      }
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});



//port address details
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




//mongodb+srv://anas:anas@cluster0.gxxnckg.mongodb.net/bidd-app?retryWrites=true&w=majority&appName=Cluster0

