const SignatureVerification = artifacts.require("SignatureVerification");

module.exports = (deployer) => {
  deployer.deploy(SignatureVerification);
};
