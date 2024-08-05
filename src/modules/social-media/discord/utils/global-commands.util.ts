import { DiscordRequest } from './discord-request.util';

export const InstallGlobalCommands = async (
  appId: string,
  commands,
  discordToken,
) => {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(
      endpoint,
      { method: 'PUT', body: commands },
      discordToken,
    );
  } catch (err) {
    console.error(err);
  }
};
