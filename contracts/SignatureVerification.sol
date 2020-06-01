pragma solidity >=0.5.0 <0.7.0;

contract SignatureVerification {
    
    address signerAddress;
    
    constructor() public {}
    
    /**
     *@dev Returns the address of the signer
     */
    function getSignerAddress() public view returns (address) {
        return signerAddress;
    }
    
    /**
     * @dev Recover signer address from a message by using their signature
     * @param hash bytes32 message, the hash is the signed message. What is recovered is the signer address.
     * @param signature bytes signature, the signature is generated using web3.eth.sign()
     */
    function recover(bytes32 hash, bytes memory signature) public {
        bytes32 r;
        bytes32 s;
        uint8 v;

        // Check the signature length
        require(signature.length == 65);

        // Divide the signature in r, s and v variables
        // ecrecover takes the signature parameters, and the only way to get them
        // currently is to use assembly.
        // solium-disable-next-line security/no-inline-assembly
        assembly {
          r := mload(add(signature, 0x20))
          s := mload(add(signature, 0x40))
          v := byte(0, mload(add(signature, 0x60)))
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
          v += 27;
        }
    
        // If the version is correct return the signer address
        require(v == 27 || v == 28, "Signature version not match");
        
        // solium-disable-next-line arg-overflow
        signerAddress = ecrecover(hash, v, r, s);
        require(signerAddress != address(0), "Invalid signature!");
  }
}