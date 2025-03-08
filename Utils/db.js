import mongoose from "mongoose";

const DbConnection = ()=>
{
    mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>
    {
        console.log("Db is Connected");
        
    }).catch((err)=>
    {
            console.log(`db error ${err}`);
            
    })
}
export default DbConnection;