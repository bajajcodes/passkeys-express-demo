class Login {
  async init() {
    //TODO: add ability to check conditional meditation is supported
    await this.checkConditionalMediationSupport();
    //TODO: add ability to get challenge from server
    const challenge = await this.getChallenge();
    //TODO: add ability to use exisiting public key credential to authenticate user
    const credentials = await this.authenticateUserWith(challenge);
    //TODO: add ability to use public key credential to login user
    const currentUser = await this.loginWith(credentials);
    //TODO: add ability to redirect user to dashboard
    this.redirect(currentUser);
  }

  async checkConditionalMediationSupport() {
    const isCMA =
      await window.PublicKeyCredential.isConditionalMediationAvailable();
    if (!isCMA) return;
  }

  async getChallenge() {
    const response = await fetch("/login/public-key/challenge", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });
    return await response.json();
  }

  async authenticateUserWith(challengeResponse) {
    const options = {
      mediation: "conditional",
      publicKey: {
        challenge: base64url.decode(challengeResponse.challenge),
      },
    };
    const credentials = await navigator.credentials.get(options);
    return credentials;
  }

  buildLoginOptionsWith(userCredentials) {
    const body = {
      id: userCredentials.id,
      response: {
        clientDataJSON: base64url.encode(
          userCredentials.response.clientDataJSON
        ),
        authenticatorData: base64url.encode(
          userCredentials.response.authenticatorData
        ),
        signature: base64url.encode(userCredentials.response.signature),
        userHandle: userCredentials.response.userHandle
          ? base64url.encode(userCredentials.response.userHandle)
          : null,
      },
    };

    if (userCredentials.authenticatorAttachment) {
      body.authenticatorAttachment = userCredentials.authenticatorAttachment;
    }

    return body;
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

  redirect(currentUser) {
    window.location.href = currentUser.destination;
  }
}

window.addEventListener("load", async () => {
  if (!window.PublicKeyCredential) return;
  const login = new Login();
  await login.init();
});
