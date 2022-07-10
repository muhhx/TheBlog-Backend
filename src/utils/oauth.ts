import axios from "axios";
import qs from "qs";
import log from "./logger";
import config from "config";

interface IGoogleTokensResult {
  access_token: string;
  expires_in: string;
  refresh_token: string;
  scopes: string;
  id_token: string;
}

interface IGoogleUserResult {
  id: string;
  email: string;
  verified_email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export async function getGoogleOAuthTokens({
  code,
}: {
  code: string;
}): Promise<IGoogleTokensResult> {
  const url = "https://oauth2.googleapis.com/token";

  const client_id = config.get<string>("client_id");
  const client_secret = config.get<string>("client_secret");
  const redirect_uri = config.get<string>("redirect_uri");

  const values = {
    code,
    client_id,
    client_secret,
    redirect_uri,
    grant_type: "authorization_code",
  };

  try {
    const res = await axios.post<IGoogleTokensResult>(
      url,
      qs.stringify(values),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return res.data;
  } catch (error: any) {
    log.error(error, "Failed to fetch google OAuth Tokens");
    throw new Error(error.message);
  }
}

export async function getGoogleUser({
  id_token,
  access_token,
}: {
  id_token: string;
  access_token: string;
}): Promise<IGoogleUserResult> {
  try {
    const res = await axios.get<IGoogleUserResult>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );

    return res.data;
  } catch (error: any) {
    log.error(error, "Failed fetching Google User.");
    throw new Error(error.message);
  }
}
