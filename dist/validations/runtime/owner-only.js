export default (command, usage) => {
    const { instance, commandObject } = command;
    const { botOwners } = instance;
    const { ownerOnly } = commandObject;
    const { user } = usage;
    if (ownerOnly === true && !botOwners.includes(user.id)) {
        return false;
    }
    return true;
};
