import mongoose from "mongoose";
const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.DB);
        console.log('Connection has been established successfully.')
    }catch(error){
        console.log(`Unable to connect to the database: ${error}`);
        process.exit(1);
    }
}
export default connectDB;