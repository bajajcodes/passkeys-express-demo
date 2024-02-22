class Register {
  async init(event) {
    //TODO: add ability to get challenge from the server
    const challenge = await this.getChallenge(event);
    //TODO: add ability to create public key credential pair
    const credentials = await this.createPublicKeyPairWith(challenge);
    //TODO: add ability to send public key + challenge to server to create new user
    const currentUser = await this.loginWith(credentials);
    //TODO: add ability to redirect to user's dashboard
    this.redirect(currentUser);
  }

  redirect(currentUser) {
    window.location.href = currentUser.destination;
  }

  buildLoginOptionsWith(userCredentials) {
    const body = {
      response: {
        clientDataJSON: base64url.encode(
          userCredentials.response.clientDataJSON
        ),
        attestationObject: base64url.encode(
          userCredentials.response.attestationObject
        ),
      },
    };

    if (userCredentials.response.getTransports) {
      body.response.transports = userCredentials.response.getTransports();
    }

    return body;
  }

  async getChallenge(event) {
    const response = await fetch("/register/public-key/challenge", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: new FormData(event.target),
    });
    return await response.json();
  }

  async createPublicKeyPairWith(challengeResponse) {
    const options = {
      publicKey: {
        rp: { name: "bajajcode" },
        user: {
          id: base64url.decode(challengeResponse.user.id),
          name: challengeResponse.user.name,
          displayName: challengeResponse.user.name,
        },
        challenge: base64url.decode(challengeResponse.challenge),
        pubKeyCredParams: [
          {
            type: "public-key",
            alg: -7, // ES256
          },
          {
            type: "public-key",
            alg: -257, // RS256
          },
          {
            type: "public-key",
            alg: -8, // Ed25519
          },
        ],
        authenticatorSelection: {
          userVerification: "preferred",
        },
      },
    };
    const newCredentials = await navigator.credentials.create(options);
    return newCredentials;
  }

  async loginWith(userCredentials) {
    const options = this.buildLoginOptionsWith(userCredentials);
    const response = await fetch("/login/public-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });
    return await response.json();
  }
}

window.addEventListener("load", async () => {
  document
    .querySelector("#registration-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const register = new Register();
      await register.init(event);
    });
});
