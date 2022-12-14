import pkg from "mongoose";
const { Schema, model, models } = pkg;
const disabledCommandSchema = new Schema({
    // guildId-commandName
    _id: {
        type: String,
        required: true,
    },
});
const name = "disabled-commands";
export default models[name] || model(name, disabledCommandSchema);
