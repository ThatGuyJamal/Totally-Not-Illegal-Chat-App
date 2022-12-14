import pkg from "mongoose";
const { Schema, model, models } = pkg;
const guildPrefixSchema = new Schema({
    // guild ID
    _id: {
        type: String,
        required: true,
    },
    prefix: {
        type: String,
        required: true,
    },
});
const name = "guild-prefixes";
export default models[name] || model(name, guildPrefixSchema);
