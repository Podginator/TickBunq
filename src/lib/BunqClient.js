const axios = require("axios");
const crypto = require("crypto");
const _ = require("lodash/fp");

const { BUNQ_PRIVATE_KEY, BUNQ_API_KEY, BUNQ_DEVICE_KEY } = process.env

class BunqClient {
  constructor(sessionToken, userId) {
    this.sessionToken = sessionToken;
    this.userId = userId;
  }

  static async createClient() {
    // Create the session.
    const params = {
      secret: BUNQ_API_KEY,
    };
    const sessionData = await axios
      .post("https://api.bunq.com/v1/session-server", params, {
        headers: {
          "X-Bunq-Client-Authentication": BUNQ_DEVICE_KEY,
          "X-Bunq-Client-Signature": _signDataForBunq(params),
        },
      })
      .then(({ data }) => data.Response)
      .catch((e) => {
        console.error(e.response.data);
        throw e;
      });

    const sessionToken = sessionData[1].Token.token;
    const sessionUserId = sessionData[2].UserPerson.id;

    return new BunqClient(sessionToken, sessionUserId);
  }

  async transferMoneyToSavings(amount, sendName, receiveName) {
    const accounts = await this.getAccounts();
    const send = this._getAccount(accounts, sendName)
    const receive = this._getAccount(accounts, receiveName)

    if (!send || !receive) {
      throw new Error("The accounts dont exist, bail!");
    }

    const params = {
      amount: {
        value: `${amount}.00`,
        currency: "EUR",
      },
      description: "You have reached some kind of habit goal! well done.",
      counterparty_alias: receive.alias[0]
    };

    return axios
      .post(
        `https://api.bunq.com/v1/user/${this.userId}/monetary-account/${send.id}/payment`,
        params,
        {
          headers: {
            "X-Bunq-Client-Authentication": this.sessionToken,
            "X-Bunq-Client-Signature": _signDataForBunq(params),
          },
        }
      )
      .catch((e) => {
        console.error(e.response.data);
        throw e;
      })
      .then(({ data }) => data.Response);
  }

  getAccounts() {
    return axios
      .get(`https://api.bunq.com/v1/user/${this.userId}/monetary-account`, {
        headers: {
          "X-Bunq-Client-Authentication": this.sessionToken,
        },
      })
      .then(({ data }) => data.Response)
      .catch((e) => {
        console.error(e.response.data);
        throw e;
      });
  }

  _getAccount(accounts, description) { 
    return _.flow(
      _.map(account => account.MonetaryAccountSavings || account.MonetaryAccountBank || {}),
      _.find(account => account.description === description)
    )(accounts)
  }
}

const _signDataForBunq = (jsonData) => {
  const sign = crypto.createSign("SHA256");

  sign.write(JSON.stringify(jsonData));
  sign.end();

  const key = Buffer.from(BUNQ_PRIVATE_KEY);
  return sign.sign(key, "base64");
};

module.exports = BunqClient;
