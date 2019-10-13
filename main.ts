namespace inosyan_command_register {
    const MIN_COMMAND_NAME_LENGTH = 3;
    let lastCommandExecuted = 0;

    class CommandData {
        commandName: string;
        command: (arg1: number, arg2: number, arg3: number) => void;

        constructor(commandName: string, command: (arg1: number, arg2: number, arg3: number) => void) {
            this.commandName = commandName;
            this.command = command;
        }
    }

    export const registerCommand = (commandName: string, command: (arg1: number, arg2: number, arg3: number) => void) => {
        if (commandName.length < MIN_COMMAND_NAME_LENGTH) {
            player.execute(`tell @s ,\nCommand name must have at least ${MIN_COMMAND_NAME_LENGTH} characters.`);
            return;
        }
        const data = new CommandData(commandName, command);

        let str = '';
        for (let i = 0; i < commandName.length; i++) {
            str += commandName[i].toLowerCase();
            if (str.length < MIN_COMMAND_NAME_LENGTH) continue;
            if (!commandTable[str]) {
                commandTable[str] = [];
                registerCommandImpl(str);
            }
            commandTable[str].push(data);
        }
    }

    const registerCommandImpl = (str: string) => {
        player.onChat(str, (arg1: number, arg2: number, arg3: number) => {
            executeCommand(str, arg1, arg2, arg3);
        });
    }

    const commandTable: { [commandName: string] : CommandData[] } = {};

    const executeCommand = (command: string, arg1: number, arg2: number, arg3: number) => {
        const commands = commandTable[command.toLowerCase()];
        if (!commands || commands.length === 0) return;
        if (commands.length > 1) {
            let str = 'Which spell do you want to cast?';
            commands.forEach((value: CommandData, index: number) => {
                str += '\n' + value.commandName;
            });
            player.execute(`tell @s ,\n${str}`);
            return;
        }

        const now = gameplay.timeQuery(TimeQuery.GameTime);
        if (now - lastCommandExecuted < 100) return;
        lastCommandExecuted = now;

        player.say(`${commands[0].commandName}!`)
        commands[0].command(arg1, arg2, arg3);
    }
}
