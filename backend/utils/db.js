import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('mongodb connected ')
    }catch(error){
        console.error(error.message);
        process.exit(1);
    }
}
 
export default connectDB;
