import { User } from "../model/user.model.js";
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are important!" });
    }
    const existing = await User.findOne({
      email: email.toLowerCase(),
    });
    if (existing) {
      return res.status(400).json({ message: "user already" });
    }
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
      loggedIn: false,
    });
    res.status(201).json({
      message: "User registered",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const loginUser = async(req,res) =>{
    try{
        const{email,password} = req.body;
        console.log("LOGIN BODY:", req.body);
        const user=await User.findOne({
            email: email.toLowerCase()});
            if(!user) return res.status(400).json({
                message:"User not found"
            });
            const isMatch = await user.comparePassword(password);
            if(!isMatch) return res.status(400).json({
                message:"Invalid credentials"
            })
            res.status(200).json({
                message:"User Logged in",
                user:{
                    id:user._id,
                    email:user.email,
                    username:user.username
                }

            })

        }catch (error){
            res.status(500).json({
                mesage:"Internal Server Error" 
            })
        }
        
    
}
const logoutuser = async (req,res) => {
  try{
    const {email} = req.body;
    const user = await User.findOne({
      email
    });if(!user) return res.status(404).json({
      message:"User not found"
    });
    res.status(200).json({
      message:"Logout successful" 
    })
  }catch (error){
    res.status(500).json({
      message:"Internal server Error",error
    });
  }
}





export { registerUser ,loginUser,logoutuser};
