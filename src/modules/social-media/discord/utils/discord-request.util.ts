import * as dotenv from 'dotenv';
dotenv.config({
  path: '.env',
});

export const DiscordRequest = async (
  endpoint: string,
  options: any,
  discordToken: string,
) => {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${discordToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    ...options,
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
};
