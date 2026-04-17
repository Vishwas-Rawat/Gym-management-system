package com.gymmanagement.usermanagement.Request;

import lombok.Data;

@Data
public class KeySyncRequest {
    private String publicKey;
    private String encryptedPrivateKey;
}
